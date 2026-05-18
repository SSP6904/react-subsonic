import React, { useState, useEffect, useMemo, useReducer } from 'react';
import { createRoot } from 'react-dom/client';
import {UserDataForm, Card, getLocalStore, UserPlaylists, UserPlaylistSelect} from './Componets.js'

const appElement = document.querySelector('#app')
const rootDom = createRoot(appElement!)

const App = function() {
    const getAuth = getLocalStore()
    return (
        <div>
            {(!getAuth) ?
                <Card title="Configuration form">
                    <div>
                        <p>Plesse fill out the required fields below before you can start using this website!</p>
                        <UserDataForm />
                    </div>
                </Card>
                :
                <Card title="Playlist selector">
                    <div>
                        <p>Select the playlist that you want to download your music from!</p>
                        <UserPlaylists auth_data={getAuth} />
                    </div>
                </Card>
            }
        </div>
    )
}

rootDom.render(
    <App />
)