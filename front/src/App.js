import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from "react-router-dom";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import NavBar from './components/NavBar.js';
import { AuthProvider } from './context/AuthContext';
import { ProjectContextProvider } from './context/ProjectContext';


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#9579d1',

    },
    secondary: {
      light: '#92ddea',
      main: '#ffa5d8',
    },
  },
});


function App() {

  return (<Router>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <ProjectContextProvider>
          <NavBar />
        </ProjectContextProvider>
      </AuthProvider>
    </ThemeProvider>
  </Router >
  );
}

export default App;
