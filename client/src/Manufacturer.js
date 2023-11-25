import React, { useState, useEffect, useRef } from 'react';
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json"
import { useHistory } from "react-router-dom"

function Manufacturer() {
    const history = useHistory()
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, [])
    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [MANname, setMANname] = useState();
    const [MANplace, setMANplace] = useState();
    const [MANaddress, setMANaddress] = useState();
     const [MANrole, setMANrole] = useState('manufacturer');
    const [MAN, setMAN] = useState();


    const [MANphone, setMANphone] = useState();
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
            const manCtr = await supplychain.methods.manCtr().call();
            const man = {};
            for (i = 0; i < manCtr; i++) {
                man[i] = await supplychain.methods.MAN(i + 1).call();
            }
            setMAN(man);
            
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

    const handlerChangeAddressMAN = (event) => {
        setMANaddress(event.target.value);
    }
    const handlerChangePlaceMAN = (event) => {
        setMANplace(event.target.value);
    }
    const handlerChangeNameMAN = (event) => {
        setMANname(event.target.value);
    }

    const handlerChangePhoneMAN = (event) => {
        setMANphone(event.target.value);
    }
    
    const handlerChangeRoleMAN = (event) => {
        setMANrole(event.target.value);
    }


    const handlerSubmitMAN = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.addManufacturer(MANaddress, MANname, MANplace, MANphone, MANrole).send({ from: currentaccount });
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
                                <span onClick={redirect_to_back} className="btn btn-outline-danger btn-sm">HOME</span>
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


                    <form onSubmit={handlerSubmitMAN} className='card p-4'>
                        <h4 className='mb-4'>Manufactuerer</h4>
                        <div className='row'>
                            <div className='col-md-6 form-group'>
                                <input className="form-control" type="text" onChange={handlerChangeAddressMAN} placeholder="Ethereum Address" required />
                            </div>
                            <div className='col-md-6 form-group'>
                                <input className="form-control" type="text" onChange={handlerChangeNameMAN} placeholder="Name" required />
                            </div>
                            <div className='col-md-6 form-group'>
                                <input className="form-control" type="text" onChange={handlerChangePlaceMAN} placeholder="Location" required />
                            </div>
                            <div className='col-md-6 form-group'>
                                <input className="form-control" type="text" onChange={handlerChangePhoneMAN} placeholder="Phone" required />
                            </div>
                            <div className='col-md-6 form-group'>
                                <input className="form-control" type="hidden" onChange={handlerChangeRoleMAN} value="manufacturer" required />
                            </div>
                            <div className='col-12'>
                                <button className="btn btn-outline-success btn-md" onSubmit={handlerSubmitMAN}>Register</button>
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
                                        {Object.keys(MAN).map(function (key) {
                                            return (
                                                <tr key={key}>
                                                    <td>{MAN[key].id}</td>
                                                    <td>{MAN[key].name}</td>
                                                    <td>{MAN[key].place}</td>
                                                    <td>{MAN[key].phone}</td>
                                                    <td>{MAN[key].role}</td>
                                                    <td>{MAN[key].addr}</td>
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

export default Manufacturer
