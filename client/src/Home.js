import React from 'react'
import { useHistory } from "react-router-dom"

function Home() {
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
        <div>
            <div className="container">
                <div className="row m-5 text-center">
                    <div className="col ">
                        <h1>Pharmaceutical Supply Chain</h1>
                    </div>
                </div>
                <div className="row my-5">
                    <div className="col-md-6">
                        <div className="card p-4 box-shadow card-wrap">
                            <img src='./images/register.png'/>
                            <button onClick={redirect_to_roles} className="btn btn-outline-primary btn-md home-button ">Register</button>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card p-4 box-shadow card-wrap">
                             <img src='./images/order.png'/>
                            <button onClick={redirect_to_addmed} className="btn btn-outline-primary btn-md home-button ">Order Medicines</button>
                        </div>
                    </div>
                </div>
                <div className="row my-5">
                    <div className="col-md-6">
                        <div className="card p-4 box-shadow card-wrap">
                        <img src='./images/supply-chain-management.png'/>
                            <button onClick={redirect_to_supply} className="btn btn-outline-primary btn-md home-button ">Control Supply Chain</button>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card p-4 box-shadow card-wrap">
                        <img src='./images/track.png'/>
                            <button onClick={redirect_to_track} className="btn btn-outline-primary btn-md home-button ">Track Medicines</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
