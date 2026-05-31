import React, { useState, useEffect, useMemo, useReducer } from 'react';
import { createRoot } from 'react-dom/client';
import {Section, Utilities, Helpers} from './Componets.js'

const App = function() {
    const [activeTab, setActiveTab] = useState('home')
    const getAuth = Utilities.LoginData()
    return (
        <>
            <header className="navbar bg-body-tertiary border-bottom mb-2 navbar-expand-lg">
                <div className="container-fluid">
                    {!getAuth ?
                    <span className="navbar-brand link-underline link-underline-opacity-0">React Subsonic</span>
                    :
                    <>
                    <a className="navbar-brand">React Subsonic</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                    <div className="collapse navbar-collapse" id="navbar">
                        <div className="navbar-nav me-auto mb-2 mb-lg-0">
                            <button className="nav-link" type="button" role="tab" onClick={() => setActiveTab("songs")}>Songs</button>
                            <button className="nav-link" type="button" role="tab" onClick={() => setActiveTab("playlists")}>Playlists</button>
                            <button className="nav-link" type="button" role="tab" onClick={() => setActiveTab("server_info")}>Server Info</button>
                            <button className="nav-link" type="button" role="tab" onClick={() => setActiveTab("user_info")}>Profile</button>
                        </div>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search for something" aria-label="Search"/>
                            <button className="btn btn-outline-success" type="submit">Find</button>
                        </form>
                    </div>
                    </>
                    }
                </div>
            </header>
            <div className="p-2 flex-grow-1 overflow-y-auto overflow-x-hidden vh-100">
                {!getAuth ? (
                    <Helpers.Card title="Configuration form">
                        <div>
                            <p>Please fill out the required fields below before you can start using this website!</p>
                            <Section.LoginForm />
                        </div>
                    </Helpers.Card>
                ) : activeTab === "user_info" ? (
                    <Helpers.Card title="User info">
                        <div>
                            <Section.UserInfo auth_data={getAuth} />
                        </div>
                    </Helpers.Card>
                ) : activeTab === "songs" ? (
                    <Helpers.Card title="Music">
                        <div>
                            <Section.MusicData auth_data={getAuth} />
                        </div>
                    </Helpers.Card>
                ) : activeTab === "playlists" ? (
                    <Helpers.Card title="Playlists">
                        <div>
                            <Section.MusicData auth_data={getAuth} />
                        </div>
                    </Helpers.Card>
                ) : activeTab === "server_info" ? (
                    <Helpers.Card title="Server Info">
                        <div>
                            <Section.ServerInfo auth_data={getAuth} />
                        </div>
                    </Helpers.Card>
                ) : 
                    <Helpers.Card title="Home">
                        <div>
                            <Section.HomePage auth_data={getAuth} />
                        </div>
                    </Helpers.Card>
                }
            </div>
            <Helpers.Footer />
        </>
    )
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
    document.documentElement.setAttribute('data-bs-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
})
document.addEventListener('DOMContentLoaded', function(event) {
    this.documentElement.setAttribute('data-bs-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    const rootDom = createRoot(this.querySelector('#app')!)
    rootDom.render(
        <App />
    )
})