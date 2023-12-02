import React from 'react'
import { useHistory } from "react-router-dom"
import '../../node_modules/particles.js/particles';

function Landing() {
    const history = useHistory()
    const redirect_to_roles = () => {
        history.push('/roles')
    }
    const redirect_to_addmed = () => {
        history.push('/addmed')
    }
    const redirect_to_supply = () => {
        history.push('/supply')
    }
    const redirect_to_track = () => {
        history.push('/track')
    }


    return (
        <div className='pt-5 vh-100 home-page dark-mode-deep-bg' >
            <div className="container pt-5">
            <div id="particles-js"></div>
                <div className="row text-center">
                    <div className="col ">
                        <h1 className='dark-mode-text'>Pharmaceutical Supply Chain</h1>
                    </div>
                </div>
                <div className="row my-5">
                    <div className="col-md-6">
                        <div className="card p-4 box-shadow card-wrap">
                            <img src='./images/register.png'/>
                            <button onClick={redirect_to_roles} className="custom-btn dark-mode-btn btn-md home-button ">Register</button>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card p-4 box-shadow card-wrap">
                             <img src='./images/order.png'/>
                            <button onClick={redirect_to_addmed} className="custom-btn dark-mode-btn btn-md home-button ">Order Medicines</button>
                        </div>
                    </div>
                </div>
                <div className="row my-5">
                    <div className="col-md-6">
                        <div className="card p-4 box-shadow card-wrap">
                        <img src='./images/supply-chain-management.png'/>
                            <button onClick={redirect_to_supply} className="custom-btn dark-mode-btn btn-md home-button ">Control Supply Chain</button>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card p-4 box-shadow card-wrap">
                        <img src='./images/track.png'/>
                            <button onClick={redirect_to_track} className="custom-btn dark-mode-btn btn-md home-button ">Track Medicines</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Landing
