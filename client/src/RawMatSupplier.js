import React, { useState, useEffect, useRef } from 'react';
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json"
import { useHistory } from "react-router-dom"


function RawMatSupplier() {

    const history = useHistory()
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();

    }, [])
    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [RMSname, setRMSname] = useState();
    const [RMSplace, setRMSplace] = useState();
    const [RMSaddress, setRMSaddress] = useState();
    const [RMSphone, setRMSphone] = useState();
    const [RMSrole, setRMSrole] = useState("rawsupplier");
    const inputRef = useRef(null);

    const copyToClipboard = () => {
        inputRef.current.select();
        document.execCommand('copy');
        alert('Address copied to clipboard!');
      };

    const [RMS, setRMS] = useState();

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
            const rmsCtr = await supplychain.methods.rmsCtr().call();
            console.log(rmsCtr);
            const rms = {};
            for (i = 0; i < rmsCtr; i++) {
                rms[i] = await supplychain.methods.RMS(i + 1).call();
            }
            setRMS(rms);
            const manCtr = await supplychain.methods.manCtr().call();
            const man = {};
            for (i = 0; i < manCtr; i++) {
                man[i] = await supplychain.methods.MAN(i + 1).call();
            }
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
    const handlerChangeAddressRMS = (event) => {
        setRMSaddress(event.target.value);
    }
    const handlerChangePlaceRMS = (event) => {
        setRMSplace(event.target.value);
    }
    const handlerChangeNameRMS = (event) => {
        setRMSname(event.target.value);
    }
    const handlerChangePhoneRMS = (event) => {
        setRMSphone(event.target.value);
    }
    
    const handlerChangeRoleRMS = (event) => {
        setRMSrole(event.target.value);
    }
  
    const handlerSubmitRMS = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.addRMS(RMSaddress, RMSname, RMSplace, RMSphone, RMSrole).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occured!!!")
        }
    }


    return (
        <div>
            <div className="container">
                <div className="row text-center">
                    <div className="col-12">
                        <div className="card p-4 my-4">
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <span onClick={redirect_to_back} className="btn btn-outline-danger btn-sm">Back</span>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <b> Account: </b>
                                    <input
                                        className='form-control'
                                        type="text"
                                        value={currentaccount}
                                        readOnly
                                        ref={inputRef}
                                    />
                                     <button onClick={copyToClipboard} className='btn btn-sm btn-secondary'>Copy</button>
                                </div>

                            </div>
                        </div>


                        <form onSubmit={handlerSubmitRMS} className='card p-4'>
                            <h4 className='mb-4'>Raw Material Suppliers</h4>
                            <div className='row'>
                                <div className='col-md-6 form-group'>
                                    <input className="form-control" type="text" onChange={handlerChangeAddressRMS} placeholder="Ethereum Address" required />
                                </div>
                                <div className='col-md-6 form-group'>
                                    <input className="form-control" type="text" onChange={handlerChangeNameRMS} placeholder="Name" required />
                                </div>
                                <div className='col-md-6 form-group'>
                                    <input className="form-control" type="text" onChange={handlerChangePlaceRMS} placeholder="Location" required />
                                </div>
                                <div className='col-md-6 form-group'>
                                    <input className="form-control" type="text" onChange={handlerChangePhoneRMS} placeholder="Phone" required />
                                </div>
                                <div className='col-md-6 form-group'>
                                    <input className="form-control" type="hidden" onChange={handlerChangeRoleRMS} value="rawsupplier" required />
                                </div>
                                <div className='col-12'>
                                    <button className="btn btn-outline-success btn-md" onSubmit={handlerSubmitRMS}>Register</button>
                                </div>
                            </div>
                        </form>
                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="card p-4">
                                    <table className="table table table-striped">
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
                                            {Object.keys(RMS).map(function (key) {
                                                return (
                                                    <tr key={key}>
                                                        <td>{RMS[key].id}</td>
                                                        <td>{RMS[key].name}</td>
                                                        <td>{RMS[key].place}</td>
                                                        <td>{RMS[key].phone}</td>
                                                        <td>{RMS[key].role}</td>
                                                        <td>{RMS[key].addr}</td>
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

export default RawMatSupplier
