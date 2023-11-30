import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from "react-router-dom"
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json"

function AddMed() {
    const history = useHistory()
    const inputRef = useRef(null);
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, [])

    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [MED, setMED] = useState();
    const [MedName, setMedName] = useState();
    const [MedDes, setMedDes] = useState();
    const [MedStage, setMedStage] = useState();


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
            const medCtr = await supplychain.methods.medicineCtr().call();
            const med = {};
            const medStage = [];
            for (i = 0; i < medCtr; i++) {
                med[i] = await supplychain.methods.MedicineStock(i + 1).call();
                medStage[i] = await supplychain.methods.showStage(i + 1).call();
            }
            setMED(med);
            setMedStage(medStage);
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

    const copyToClipboard = () => {
        inputRef.current.select();
        document.execCommand('copy');
        alert('Address copied to clipboard!');
    };
    const handlerChangeNameMED = (event) => {
        setMedName(event.target.value);
    }
    const handlerChangeDesMED = (event) => {
        setMedDes(event.target.value);
    }
    const handlerSubmitMED = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.addMedicine(MedName, MedDes).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occured!!!")
        }
    }
    return (
        <div className='dark-mode-deep-bg'>
            <div className='container pt-5'>
                <div className="row text-center">
                    <div className="col-sm-12">
                        <div className="card p-4 my-4 dark-mode-light-bg">
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <span onClick={redirect_to_back} className="custom-btn dark-mode-btn btn-md">HOME</span>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <b className='dark-mode-text align-self-center'> Account: </b>
                                    <input
                                        className='form-control mx-2'
                                        type="text"
                                        value={currentaccount}
                                        readOnly
                                        ref={inputRef}
                                    />
                                    <button onClick={copyToClipboard} className='custom-btn dark-mode-btn btn-md'>Copy</button>
                                </div>

                            </div>
                        </div>
                        <div className="card p-4 my-4 dark-mode-light-bg">
                            <h4 className='dark-mode-text'>Add Medicine Order:</h4>
                            <form onSubmit={handlerSubmitMED} className='text-left'>
                                <div className="mb-3">
                                    <label for="exampleFormControlInput1" className="form-label dark-mode-text">Medicine Name</label>
                                    <input type="text" onChange={handlerChangeNameMED} className="form-control" id="exampleFormControlInput1" placeholder="Napa Extra" />
                                </div>
                                <div className="mb-3">
                                    <label for="exampleFormControlTextarea1" className="form-label dark-mode-text">Medicine Description</label>
                                    <textarea className="form-control" onChange={handlerChangeDesMED} id="exampleFormControlTextarea1" rows="3"></textarea>
                                </div>
                                <button className="btn custom-btn dark-mode-btn btn-md" onSubmit={handlerSubmitMED}>Order</button>
                            </form>
                        </div>
                        <div className="card p-4 my-4 dark-mode-light-bg">
                            <h5 className='dark-mode-text mb-4'>Ordered Medicines:</h5>
                            <table className="table table-striped dark-mode-text">
                                <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Current Stage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(MED).map(function (key) {
                                        return (
                                            <tr key={key}>
                                                <td>{MED[key].id}</td>
                                                <td>{MED[key].name}</td>
                                                <td>{MED[key].description}</td>
                                                <td>
                                                    {
                                                        MedStage[key]
                                                    }
                                                </td>
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
    )
}

export default AddMed
