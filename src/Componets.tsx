import React, {useState, ChangeEvent, ReactNode, ReactElement} from "react";

interface UserData {
    instance_url: string,
    username: string,
    password: string,
    app_name: string,
    version: string
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

export const fetchAPI = async function(url: string, method: "GET" | "POST") {
    return fetch(url, {
        method: method,
        body: undefined
    }).then(function(response) {
        if (!response.ok) {
            throw new Error("Server responded with a " + response.status + " code!")
        }
        return response.json()
    }).then(function(data) {
        return data
    }).catch(function(error) {
        const errorMsg = error instanceof Error ? error.message : "Something went wrong! Cannot continue!"
        return Error(errorMsg)
    })
}
export const getLocalStore = function() {
    const storageName = localStorage.getItem('user_info')
    if (!storageName) {
        return false
    } else {
        return storageName
    }
}
export const UserDataForm = function() {
    function handleChange(event: ChangeEvent<HTMLFormElement>) {
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
        const jsonData = {
            instance_url: formData.instance_url?.toString(),
            username: formData.username?.toString(),
            password: formData.password?.toString(),
            app_name: formData.app_name?.toString(),
            version: formData.version?.toString()
        }
        const checkStorage = getLocalStore()
        if (!checkStorage) {
            localStorage.setItem('user_info', JSON.stringify(jsonData))
            window.location.reload()
        }
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
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </section>
    )
}
export const UserPlaylists = function({auth_data}: {auth_data: string}) {
    let PlayLists: Array<UserPlaylists> = []
    const jsonParse: UserData = JSON.parse(auth_data)
    const url_request = new URL(jsonParse.instance_url + "/rest/getPlaylists")
    url_request.searchParams.set('u', jsonParse.username)
    url_request.searchParams.set('p', jsonParse.password)
    url_request.searchParams.set('v', jsonParse.version)
    url_request.searchParams.set('c', jsonParse.app_name)
    url_request.searchParams.set('f', 'json')
    fetchAPI(url_request.href, "GET").then(function(data) {
        if (data instanceof Error) {
            alert(data.message)
            console.error(data.message)
            //window.location.reload()
        } else {
            const response: Array<any> = data['subsonic-response'].playlists.playlist
            response.forEach(function(item) {
                PlayLists.push({
                    id: item.id,
                    name: item.name
                })
            })
        }
    })
    function handleChangeOne(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault()
    }
    return (
        <section>
            <form onSubmit={handleChangeOne}>
                <button type="submit" className="btn btn-primary">Fetch the data</button>
            </form>
        </section>
    )
}
export const UserPlaylistSelect = function() {
    function handleChange(event: ChangeEvent<HTMLFormElement>) {
        const userData = getLocalStore()
        if (!userData) {
            window.location.reload()
        } else {
            const jsonParse: UserData = JSON.parse(userData)
            const url_request = new URL(jsonParse.instance_url + "/rest/getPlaylists")
            url_request.searchParams.set('u', jsonParse.username)
            url_request.searchParams.set('p', jsonParse.password)
            url_request.searchParams.set('v', jsonParse.version)
            url_request.searchParams.set('c', jsonParse.app_name)
            url_request.searchParams.set('f', 'json')
            fetchAPI(url_request.href, "GET").then(function(data) {
                if (data instanceof Error) {
                    alert(data.message)
                    console.error(data.message)
                    //window.location.reload()
                } else {
                    const jsonData: UserPlaylists = data
                    console.log(jsonData)
                }
            })
        }
        event.preventDefault()
    }
    return (
        <section>
            <form onSubmit={handleChange}>
                <button type="submit" className="btn btn-primary">Download my song!</button>
            </form>
        </section>
    )
}
export const Card = function({title, children}: {title: string | null, children: ReactNode | ReactElement}) {
    return (
        <div className="card">
            <div className="card-body">
                {(title !== null) &&
                    <h5 className="card-title">{title}</h5>
                }
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}
//data['subsonic-response'].playlist.entry