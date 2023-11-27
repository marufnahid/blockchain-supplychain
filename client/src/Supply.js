import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from "react-router-dom"
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json"

function Supply() {
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
    const [MedStage, setMedStage] = useState();
    const [ID, setID] = useState();
    const [ROLE, setROLE] = useState();
    const [consumerName, setConsumerName] = useState();
    const [consumerPhone, setConsumerPhone] = useState();


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
            const userRole = await supplychain.methods.findUserByAddress(account).call();
            setROLE(userRole);
            console.log(userRole);
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

    const handlerChangeConsumerName = (event) => {
        setConsumerName(event.target.value);
    }

    const handlerChangeConsumerPhone = (event) => {
        setConsumerPhone(event.target.value);
    }

    const copyToClipboard = () => {
        inputRef.current.select();
        document.execCommand('copy');
        alert('Address copied to clipboard!');
    };

    const handlerChangeID = (event) => {
        setID(event.target.value);
    }
    const handlerSubmitRMSsupply = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.RMSsupply(ID).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occured!!!")
        }
    }
    const handlerSubmitManufacturing = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.Manufacturing(ID).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occured!!!")
        }
    }
    const handlerSubmitDistribute = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.Distribute(ID).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occured!!!")
        }
    }
    const handlerSubmitRetail = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.Retail(ID).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occured!!!")
        }
    }
    const handlerSubmitSold = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.sold(ID, consumerName, consumerPhone).send({ from: currentaccount });
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
            <div className='container mt-5 '>
                <div className="row">
                    <div className="col-sm-12">
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


                        <h6><b>Supply Chain Flow:</b></h6>
                        <ul id="progressbar" className='supply-progress'>
                        
                            <li className="active">Order</li>
                            <li className="active">Raw Material Supplier</li>
                            <li className="active">Manufacturer</li>
                            <li className="active">Distributor</li>
                            <li className="active">Retailer</li>
                            <li className="active">Consumer</li>
                        </ul>
                        <table className="table table-stripped text-center table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">Medicine ID</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Current Processing Stage</th>
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
                        {ROLE[3] === "rawsupplier" && (
                            <div className='row mt-5'>
                                <div className='col-md-8 offset-md-2'>
                                    <div className='card p-4'>
                                        <h5>Supply Raw Materials</h5>
                                        <form onSubmit={handlerSubmitRMSsupply}>
                                            <div className='form-group'>
                                                <label>Medicine ID</label>
                                                <input className="form-control" type="text" onChange={handlerChangeID} placeholder="Enter Medicine ID" required />
                                            </div>
                                            <div className='form-group'>
                                                <button className="btn btn-outline-success" >Supply</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                        {console.log(ROLE[3])}
                        <br />
                        {ROLE[3] === "manufacturer" && (
                            <div className='row'>
                                <div className='col-sm-6 offset-md-3'>
                                    <div className='card p-4'>
                                        <h5>Manufacture</h5>
                                        <form onSubmit={handlerSubmitManufacturing}>
                                            <div className='form-group'>
                                                <label>Medicine ID</label>
                                                <input className="form-control" type="text" onChange={handlerChangeID} placeholder="Enter Medicine ID" required />
                                            </div>
                                            <div className='form-group'>
                                                <button className="btn btn-outline-success" onSubmit={handlerSubmitManufacturing}>Manufacture</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}

                        <br />
                        {ROLE[3] === "distributor" && (
                            <div className='row'>
                                <div className='col-sm-6 offset-md-3'>
                                    <div className='card p-4'>
                                        <h5>Distribute</h5>
                                        <form onSubmit={handlerSubmitDistribute}>
                                            <div className='form-group'>
                                                <label>Medicine ID</label>
                                                <input className="form-control" type="text" onChange={handlerChangeID} placeholder="Enter Medicine ID" required />
                                            </div>
                                            <div className='form-group'>
                                                <button className="btn btn-outline-success" onSubmit={handlerSubmitDistribute}>Distribute</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                        <br />
                        {ROLE[3] === "retailer" && (
                            <div className='row'>
                                <div className='col-sm-6'>
                                    <div className='card p-4'>
                                        <h5>Retail</h5>
                                        <form onSubmit={handlerSubmitRetail}>
                                            <div className='form-group'>
                                                <label>Medicine ID</label>
                                                <input className="form-control" type="text" onChange={handlerChangeID} placeholder="Enter Medicine ID" required />
                                            </div>
                                            <div className='form-group'>
                                                <button className="btn btn-outline-success" onSubmit={handlerSubmitRetail}>Retail</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className='col-sm-6'>
                                    <div className='card p-4'>
                                        <h5>Mark as sold</h5>
                                        <form onSubmit={handlerSubmitSold}>
                                            <div className='form-group'>
                                                <label>Medicine ID</label>
                                                <input className="form-control" type="text" onChange={handlerChangeID} placeholder="Enter Medicine ID" required />
                                            </div>
                                            <div className='form-group'>
                                                <label>Consumer Name</label>
                                                <input className="form-control" type="text" onChange={handlerChangeConsumerName} placeholder="Consumer Name" required />
                                            </div>
                                            <div className='form-group'>
                                                <label>Consumer Phone</label>
                                                <input className="form-control" type="text" onChange={handlerChangeConsumerPhone} placeholder="Consumer Phone" required />
                                            </div>
                                            <div className='form-group'>
                                                <button className="btn btn-outline-success" onSubmit={handlerSubmitSold}>Sold</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Supply
