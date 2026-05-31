import React, { useState, ChangeEvent, ReactNode, ReactElement, MouseEventHandler, useEffect } from "react";
import md5 from "md5";

interface UserAuth {
    instance_url: string
    username: string
    password: string
    app_name: string
    version: string
    roles: {
        scrobblingEnabled: boolean
        adminRole: boolean
        settingsRole: boolean
        downloadRole: boolean
        uploadRole: boolean
        playlistRole: boolean
        coverArtRole: boolean
        commentRole: boolean
        podcastRole: boolean
        streamRole: boolean
        jukeboxRole: boolean
        shareRole: boolean
        videoConversionRole: boolean
    }
}
interface UserPlaylists {
    id: number
    name: string
}
interface PlaylistData {
    id: number
    title: string
    album: string
    artist: string
    stream_url: string
    year: number
    track: number
}

export class Utilities {
    static ErrorHandler(code: number, reason: string) {
        const templateMsg =
            `
        Something went wrong! \n
        Stack code: ${code} \n
        Cause: ${reason}
        `
        console.error(templateMsg)
    }
    static async FetchAPI(url: string, method: "GET" | "POST") {
        return fetch(url, {
            method: method,
            body: undefined
        }).then(function (response) {
            if (!response.ok) {
                throw new Error("Server responded with a " + response.status + " code!")
            }
            return response.json()
        }).then(function (data) {
            const jsonData = data['subsonic-response']
            return jsonData
        }).catch(function (error) {
            const errorMsg = error instanceof Error ? error.message : "Something went wrong! Cannot continue!"
            return Error(errorMsg)
        })
    }
    static LoginData() {
        const storageName = localStorage.getItem('user_info')
        if (!storageName) {
            return null
        } else {
            const jsonParse = JSON.parse(storageName)
            return {
                instance_url: jsonParse.instance_url,
                username: jsonParse.username,
                password: jsonParse.password,
                app_name: jsonParse.app_name,
                version: jsonParse.version,
                roles: {
                    scrobblingEnabled: jsonParse.roles.scrobblingEnabled,
                    adminRole: jsonParse.roles.adminRole,
                    settingsRole: jsonParse.roles.settingsRole,
                    downloadRole: jsonParse.roles.downloadRole,
                    uploadRole: jsonParse.roles.uploadRole,
                    playlistRole: jsonParse.roles.playlistRole,
                    coverArtRole: jsonParse.roles.coverArtRole,
                    commentRole: jsonParse.roles.commentRole,
                    podcastRole: jsonParse.roles.podcastRole,
                    streamRole: jsonParse.roles.streamRole,
                    jukeboxRole: jsonParse.roles.jukeboxRole,
                    shareRole: jsonParse.roles.shareRole,
                    videoConversionRole: jsonParse.roles.videoConversionRole
                }
            } as UserAuth
        }
    }
    static PingInstance(auth_data: UserAuth) {
        let response = true
        const url_request = new URL(auth_data.instance_url + "/rest/ping")
        url_request.searchParams.set('u', auth_data.username)
        url_request.searchParams.set('p', auth_data.password)
        url_request.searchParams.set('v', auth_data.version)
        url_request.searchParams.set('c', auth_data.app_name)
        url_request.searchParams.set('f', 'json')
        Utilities.FetchAPI(url_request.href, "GET").then(function (data) {
            if (data instanceof Error) {
                response = false
            } else {
                response = true
            }
        })
        return response
    }
    static FormatDuration(time: number) {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60
        const m = minutes.toString().padStart(2, '0')
        const s = seconds.toString().padStart(2, '0')
        return `${m}:${s}`
    }
}

export class Section {
    static LoginForm() {
        document.title = "Configuration form"
        const handleChange = function (event: ChangeEvent<HTMLFormElement>) {
            const formRequest = new FormData(event.target)
            const formData = {
                instance_url: formRequest.get('instance_url'),
                username: formRequest.get('username'),
                password: formRequest.get('password'),
                app_name: formRequest.get('app_name'),
                version: formRequest.get('version')
            }
            if (!formData.instance_url || !formData.username || !formData.password || !formData.app_name || !formData.version) {
                alert("Please fill out the required form fields!")
                console.error("Please fill out the required form fields!")
            }
            const url_request = new URL(formData.instance_url?.toString() + "/rest/getUser")
            url_request.searchParams.set('u', formData.username?.toString()!)
            url_request.searchParams.set('p', formData.password?.toString()!)
            url_request.searchParams.set('v', formData.version?.toString()!)
            url_request.searchParams.set('c', formData.app_name?.toString()!)
            url_request.searchParams.set('f', "json")
            url_request.searchParams.set('username', formData.username?.toString()!)
            Utilities.FetchAPI(url_request.href, "GET").then(function (response) {
                if (response instanceof Error) {
                    Utilities.ErrorHandler(500, response.message)
                } else {
                    const jsonData = {
                        instance_url: formData.instance_url?.toString(),
                        username: formData.username?.toString(),
                        password: `enc:${md5(formData.password?.toString()!)}`,
                        app_name: formData.app_name?.toString(),
                        version: formData.version?.toString(),
                        roles: {
                            scrobblingEnabled: response.user.scrobblingEnabled,
                            adminRole: response.user.adminRole,
                            settingsRole: response.user.settingsRole,
                            downloadRole: response.user.downloadRole,
                            uploadRole: response.user.uploadRole,
                            playlistRole: response.user.playlistRole,
                            coverArtRole: response.user.coverArtRole,
                            commentRole: response.user.commentRole,
                            podcastRole: response.user.podcastRole,
                            streamRole: response.user.streamRole,
                            jukeboxRole: response.user.jukeboxRole,
                            shareRole: response.user.shareRole,
                            videoConversionRole: response.user.videoConversionRole
                        }
                    }
                    const checkStorage = Utilities.LoginData()
                    if (!checkStorage) {
                        localStorage.setItem('user_info', JSON.stringify(jsonData))
                        window.location.reload()
                    }
                }
            })
            event.preventDefault()
        }
        return (
            <section>
                <form onSubmit={handleChange}>
                    <div className="formBlock">
                        <label htmlFor="instance_url">Your Instance URL</label>
                        <input type="text" className="form-control" name="instance_url" id="instance_url" autoComplete="no" required={true} />
                    </div>
                    <div className="formBlock">
                        <label htmlFor="username">Your Username</label>
                        <input type="text" className="form-control" name="username" id="username" autoComplete="no" required={true} />
                    </div>
                    <div className="formBlock">
                        <label htmlFor="password">Your Password</label>
                        <input type="password" className="form-control" name="password" id="password" autoComplete="no" required={true} />
                    </div>
                    <div className="formBlock">
                        <label htmlFor="app_name">Your Application Name</label>
                        <input type="text" className="form-control" name="app_name" id="app_name" autoComplete="no" required={true} />
                    </div>
                    <div className="formBlock">
                        <label htmlFor="version">API version</label>
                        <input type="text" className="form-control" name="version" id="version" autoComplete="no" required={true} />
                    </div>
                    <button type="submit" className="btn btn-primary w-100"><i className="bi bi-box-arrow-in-left me-1"></i>Submit</button>
                </form>
            </section>
        )
    }
    static UserInfo({ auth_data }: { auth_data: UserAuth }) {
        document.title = "Your profile"
        const handleChange = function (event: ChangeEvent<HTMLFormElement>) {
            localStorage.removeItem('user_info')
            window.location.reload()
            event.preventDefault()
        }
        console.log(JSON.parse(localStorage.user_info))
        return (
            <section>
                <h2>Authentication data</h2>
                <ul className="list-unstyled">
                    <li>Username: <code>{auth_data.username}</code></li>
                    <li>Password: <strong>REDACTED</strong></li>
                    <li>Instance URL: <code>{auth_data.instance_url}</code></li>
                    <li>Application name: <code>{auth_data.app_name}</code></li>
                    <li>API version: <code>{auth_data.version}</code></li>
                    <li>Roles:
                        <ul>
                            <li>Scrobbling: {auth_data.roles.scrobblingEnabled ? "Yes" : "No"}</li>
                            <li>Admin: {auth_data.roles.adminRole ? "Yes" : "No"}</li>
                            <li>Settings: {auth_data.roles.settingsRole ? "Yes" : "No"}</li>
                            <li>Download: {auth_data.roles.downloadRole ? "Yes" : "No"}</li>
                            <li>Upload: {auth_data.roles.uploadRole ? "Yes" : "No"}</li>
                            <li>Playlist: {auth_data.roles.playlistRole ? "Yes" : "No"}</li>
                            <li>Cover art: {auth_data.roles.coverArtRole ? "Yes" : "No"}</li>
                            <li>Comment: {auth_data.roles.commentRole ? "Yes" : "No"}</li>
                            <li>Podcast: {auth_data.roles.podcastRole ? "Yes" : "No"}</li>
                            <li>Stream: {auth_data.roles.streamRole ? "Yes" : "No"}</li>
                            <li>Jukebox: {auth_data.roles.jukeboxRole ? "Yes" : "No"}</li>
                            <li>Share: {auth_data.roles.shareRole ? "Yes" : "No"}</li>
                            <li>Video conversion: {auth_data.roles.videoConversionRole ? "Yes" : "No"}</li>
                        </ul>
                    </li>
                </ul>
                <h2>Actions</h2>
                <form onSubmit={handleChange}>
                    <button type="submit" className="btn btn-danger w-100"><i className="bi bi-box-arrow-right me-1"></i>Logout</button>
                </form>
            </section>
        )
    }
    static MusicData({ auth_data }: { auth_data: UserAuth }) {
        document.title = "Music"
        interface MusicList {
            id: number
            title: string
            album: string
            artist: string
            coverArt: number
            size: number
            duration: number
            created: string
        }
        const [data, setData] = useState<MusicList[] | null>(null)
        const [refreshSignal, setRefreshSignal] = useState(0)
        useEffect(function() {
            const fetchData = async function() {
                const url_request = new URL(auth_data.instance_url + "/rest/getRandomSongs")
                url_request.searchParams.set('u', auth_data.username)
                url_request.searchParams.set('p', auth_data.password)
                url_request.searchParams.set('v', auth_data.version)
                url_request.searchParams.set('c', auth_data.app_name)
                url_request.searchParams.set('f', "json")
                return Utilities.FetchAPI(url_request.href, "GET").then(function(response) {
                    if (response instanceof Error) {
                        Utilities.ErrorHandler(50, response.message)
                    } else {
                        setData(response.randomSongs.song)
                    }
                })
            }
            fetchData()
        }, [refreshSignal])
        const reloadData = function() {
            setRefreshSignal(prev => prev + 1)
        }
        return (
            <section>
                <div className="grid-large">
                    {data?.map((item) => (
                        <Helpers.Card title={null}>
                            <>
                            <span className="">{item.title}</span>
                                <ul className="list-unstyled">
                                    <li>ID: {item.id}</li>
                                    <li>Artist: {item.artist}</li>
                                    <li>Album: {item.album}</li>
                                    <li>Duration: {Utilities.FormatDuration(item.duration)}</li>
                                    <li>Creation date: {new Date(item.created).toString()}</li>
                                </ul>
                            </>
                            <br />
                            <>
                                <div className="row">
                                    <div className="col"><button type="button" className="btn btn-primary w-100"><i className="bi bi-play-circle-fill me-1"></i>Play</button></div>
                                    <div className="col"><button type="button" className="btn btn-primary w-100"><i className="bi bi-cloud-arrow-down-fill me-1"></i>Download</button></div>
                                </div>
                            </>
                        </Helpers.Card>
                    ))}
                </div>
                <br />
                <div className="row ps-2 pe-2">
                    <button className="btn btn-primary w-100" type="button" onClick={reloadData}><i className="bi bi-arrow-clockwise me-1"></i>Reload data</button>
                </div>
            </section>
        )
    }
    static PlaylistsData({ auth_data }: { auth_data: UserAuth }) {
        document.title = "Playlist selector"
        const PlaylistsData = function () {
            let data_array: Array<UserPlaylists> = []
            const url_request = new URL(auth_data.instance_url + "/rest/getPlaylists")
            url_request.searchParams.set('u', auth_data.username)
            url_request.searchParams.set('p', auth_data.password)
            url_request.searchParams.set('v', auth_data.version)
            url_request.searchParams.set('c', auth_data.app_name)
            url_request.searchParams.set('f', 'json')
            Utilities.FetchAPI(url_request.href, "GET").then(function (data) {
                if (data instanceof Error) {
                    alert(data.message)
                    console.error(data.message)
                    //window.location.reload()
                } else {
                    const response: Array<any> = data.playlists.playlist
                    response.forEach(function (item) {
                        data_array.push({
                            id: Number(item.id),
                            name: String(item.name)
                        })
                    })
                }
            })
            console.log(data_array)
            return data_array
        }
        const handleChangeOne = function (event: ChangeEvent<HTMLFormElement>) {
            event.preventDefault()
        }
        const playlist_ids = PlaylistsData().map(item =>
            `${item.id} - ${item.name}`
        ).join('\n')
        return (
            <section>
                <div>
                    <p>Available playlist ID's: </p>
                    <ul>
                        <li>{playlist_ids}</li>
                    </ul>
                </div>
                <form onSubmit={handleChangeOne}>
                    <div className="formBlock">
                        <label htmlFor="playlist_id">Enter the playlist ID</label>
                        <input type="number" className="form-control" name="playlist_id" id="playlist_id" required={true} autoComplete="off" />
                    </div>
                    <button type="submit" className="btn btn-primary">Fetch the data</button>
                </form>
            </section>
        )
    }
    static ServerInfo({ auth_data }: { auth_data: UserAuth }) {
        document.title = "Server info"
        return (
            <section>
                <div></div>
            </section>
        )
    }
    static HomePage({ auth_data }: { auth_data: UserAuth }) {
        document.title = "Home"
        const checkInstance = Utilities.PingInstance(auth_data) ? "All good! Your instance is online!" : "Looks like your instance isn't responding well!"
        return (
            <section>
                <div>
                    <p>This is a React-based version of your Subsonic instance. All functions are powered by the API, and nothing else!</p>
                </div>
                <div>
                    <h2>Instance checker</h2>
                    <p>To make sure that everything works well before you do anything, check to see if you are able to ping your instance.</p>
                    <span>Result: <strong>{checkInstance}</strong></span>
                </div>
            </section>
        )
    }
}

export class Helpers {
    static Card({ title, children }: { title: string | null, children: ReactNode | ReactElement }) {
        return (
            <div className="card">
                <div className="card-body">
                    {(title !== null) &&
                        <h1 className="card-title">{title}</h1>
                    }
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        )
    }
    static Header() {
        return (
            <header className="navbar bg-body-tertiary border-bottom mb-2">
                <div className="container-fluid">
                    <span className="navbar-brand h1 mb-0 link-underline link-underline-opacity-0">React Subsonic</span>
                </div>
            </header>
        )
    }
    static Footer() {
        return (
            <footer className="bg-body-tertiary text-white text-center border-top p-2 mt-2">
                <p className="mb-0">
                    <a className="link-underline link-underline-opacity-0 text-decoration-none" href="https://github.com/SSP6904/react-subsonic">View source code</a>
                </p>
            </footer>
        )
    }
}