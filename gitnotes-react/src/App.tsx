import React from 'react';
import logo from './logo.svg';
import './App.css';
import Editor from 'rich-markdown-editor';

function App() {
    return (
        <div className="App">
            <Editor defaultValue="Hello world!" />
        </div>
    );
}

export default App;
