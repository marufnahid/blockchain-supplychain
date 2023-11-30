import React, { useState, useEffect, useRef } from 'react';
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json"
import { useHistory } from "react-router-dom"

function Retailer() {
    const history = useHistory()
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, [])


    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [RETname, setRETname] = useState();
    const [RETplace, setRETplace] = useState();
    const [RETaddress, setRETaddress] = useState();
    const [RETrole, setRETrole] = useState("retailer");
    const [RET, setRET] = useState();


    const [RETphone, setRETphone] = useState();
    const inputRef = useRef(null);

    const copyToClipboard = () => {
        inputRef.current.select();
        document.execCommand('copy');
        alert('Address copied to clipboard!');
    };

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert(
                "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
        }
    };

    const loadBlockchaindata = async () => {
        setloader(true);
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        setCurrentaccount(account);
        const networkId = await web3.eth.net.getId();
        const networkData = SupplyChainABI.networks[networkId];
        if (networkData) {
            const supplychain = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);
            setSupplyChain(supplychain);
            var i;
            const retCtr = await supplychain.methods.retCtr().call();
            const ret = {};
            for (i = 0; i < retCtr; i++) {
                ret[i] = await supplychain.methods.RET(i + 1).call();
            }
            setRET(ret);

            setloader(false);
        }
        else {
            window.alert('The smart contract is not deployed to current network')
        }
    }
    if (loader) {
        return (
            <div>
                <h1 className="wait">Loading...</h1>
            </div>
        )

    }
    const redirect_to_back = () => {
        history.goBack()
    }

    const handlerChangeAddressRET = (event) => {
        setRETaddress(event.target.value);
    }
    const handlerChangePlaceRET = (event) => {
        setRETplace(event.target.value);
    }
    const handlerChangeNameRET = (event) => {
        setRETname(event.target.value);
    }

    const handlerChangePhoneRET = (event) => {
        setRETphone(event.target.value);
    }

    const handlerChangeRoleRET = (event) => {
        setRETrole(event.target.value);
    }


    const handlerSubmitRET = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.addRetailer(RETaddress, RETname, RETplace, RETphone, RETrole).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occured!!!")
        }
    }




    return (
        <div className='dark-mode-deep-bg vh-100'>
            <div className="container">
                <div className="row text-center">
                    <div className="col-12">
                        <div className="card p-4 my-4 dark-mode-light-bg">
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <span onClick={redirect_to_back} className="custom-btn dark-mode-btn btn-md">Back</span>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <b className='align-self-center dark-mode-text'> Account: </b>
                                    <input
                                        className='form-control mx-2'
                                        type="text"
                                        value={currentaccount}
                                        readOnly
                                        ref={inputRef}
                                    />
                                    <button onClick={copyToClipboard} className='custom-btn dark-mode-btn'>Copy</button>
                                </div>

                            </div>
                        </div>


                        <form onSubmit={handlerSubmitRET} className='card p-4 dark-mode-light-bg'>
                            <h4 className='mb-4 dark-mode-text'>Retailer</h4>
                            <div className='row'>
                                <div className='col-md-6 form-group'>
                                    <input className="form-control" type="text" onChange={handlerChangeAddressRET} placeholder="Ethereum Address" required />
                                </div>
                                <div className='col-md-6 form-group'>
                                    <input className="form-control" type="text" onChange={handlerChangeNameRET} placeholder="Name" required />
                                </div>
                                <div className='col-md-6 form-group'>
                                    <input className="form-control" type="text" onChange={handlerChangePlaceRET} placeholder="Location" required />
                                </div>
                                <div className='col-md-6 form-group'>
                                    <input className="form-control" type="text" onChange={handlerChangePhoneRET} placeholder="Phone" required />
                                </div>
                                <div className='col-md-6 form-group'>
                                    <input className="form-control" type="hidden" onChange={handlerChangeRoleRET} value="retailer" required />
                                </div>

                                <div className='col-12'>
                                    <button className="custom-btn btn dark-mode-btn btn-md" onSubmit={handlerSubmitRET}>Register</button>
                                </div>
                            </div>
                        </form>
                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="card p-4 dark-mode-light-bg">
                                    <table className="table table table-striped dark-mode-text">
                                        <thead>
                                            <tr>
                                                <th scope="col">ID</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Place</th>
                                                <th scope="col">Phone</th>
                                                <th scope="col">Role</th>
                                                <th scope="col">Ethereum Address</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(RET).map(function (key) {
                                                return (
                                                    <tr key={key}>
                                                        <td>{RET[key].id}</td>
                                                        <td>{RET[key].name}</td>
                                                        <td>{RET[key].place}</td>
                                                        <td>{RET[key].phone}</td>
                                                        <td>{RET[key].role}</td>
                                                        <td>{RET[key].addr}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Retailer
