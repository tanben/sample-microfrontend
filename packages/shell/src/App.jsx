import React,{Suspense} from "react";
import ReactDOM from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import { asyncWithLDProvider, useFlags } from 'launchdarkly-react-client-sdk';
import NavBar from "./components/NavBar";

import "./index.css";
const Header = React.lazy(() => import('components/Header'));
const HeaderNew = React.lazy(() => import('components/HeaderNew'));
const Footer = React.lazy(() => import('components/Footer'));
const Loading = React.lazy(() => import('content/Loading'));
const Body = React.lazy(() => import('content/Body'));
const BodyLDInit = React.lazy(() => import('content/BodyLDInit'));
const FlagStatus = React.lazy(() => import('components/FlagStatus'));
const FlagBoolEval = React.lazy(() => import('components/FlagBoolEval'));
const FlagConditionalRender = React.lazy(() => import('components/FlagConditionalRender'));

import  {clientSideID} from 'Config';


const LDProvider = await asyncWithLDProvider({
    clientSideID,
    context: {
      "kind": "user",
      "key": "user-key-123abc",
      "name": "James Wilson",
      "email": "jwilson@example.com",
      "anonymous": true
    },
    options: { /* ... */ }
  });

const Message=({message})=>(
    <FlagBoolEval flagKey="enableMessage">
        <span style={{color:"red"}}>{message}</span>
    </FlagBoolEval>
);

const LogFlagStatus=({flagKey})=>{
  const flags = useFlags(); 
  console.log( `${flagKey}=${flags[flagKey]}`);
  return <></>;
}

const App = () => (
  
  <LDProvider>
    <LogFlagStatus flagKey="simpleToggle"/>
    
    <div id="shell" className="container">
      <span className="pad-left10"> Host : <FlagStatus/> </span>
       <div style={{fontSize:"1rem", paddingLeft:"10px"}}>Package: shell</div>
     
   
       <BrowserRouter>
        <NavBar />

        <FlagConditionalRender flagKey="enableNewHeader" element={<HeaderNew/>}>
          <Header/>
        </FlagConditionalRender>
        
          <Routes>
            <Route exact path='/' element={
              <Suspense fallback={<Loading/>}>
                <Body> 
                  <Message message="Special public announcement."/>
                </Body>
              </Suspense> 
            } />
            <Route exact path='/multi-project' element={
                <Suspense fallback={<Loading/>}>
                  <BodyLDInit>
                    <Message message="Special public announcement."/>
                  </BodyLDInit>
                </Suspense> 
            } />
          </Routes>
      </BrowserRouter>  
      <Footer/>
      
    </div>
  </LDProvider>
);

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);