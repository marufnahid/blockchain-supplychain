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

    const isRoleDefined = ROLE && ROLE[3] !== undefined && ROLE[3] !== null && ROLE[3] !== "";

    return (
        <div className='dark-mode-deep-bg '>
            <div className='container pt-5 '>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card p-4 my-4 dark-mode-light-bg">
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <span onClick={redirect_to_back} className="custom-btn dark-mode-btn btn-md">HOME</span>
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
                                    <button onClick={copyToClipboard} className='custom-btn dark-mode-btn btn-md'>Copy</button>
                                </div>

                            </div>
                        </div>

                        <div className='card p-4 my-4 dark-mode-light-bg'>
                            <h6 className='dark-mode-text mb-4'><b>Supply Chain Flow:</b></h6>
                            <ul id="progressbar" className='supply-progress'>
                                <li className="active">Order</li>
                                <li className="active">Raw Material Supplier</li>
                                <li className="active">Manufacturer</li>
                                <li className="active">Distributor</li>
                                <li className="active">Retailer</li>
                                <li className="active">Consumer</li>
                            </ul>
                        </div>
                        <div className='row'>
                            <div className={`col-${isRoleDefined ? 'md-8' : '12'}`}>
                                <div className='card p-4 my-4 dark-mode-light-bg'>
                                    <h4 className='dark-mode-text mb-4 text-center'><b>Medicine On Queue</b></h4>
                                    <table className="table table-stripped text-center dark-mode-text">
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
                                </div>

                            </div>

                            {console.log(isRoleDefined)}

                            {isRoleDefined && (
                        
                            <div className='col-md-4 mt-4'>
                                {ROLE[3] === "rawsupplier" && (
                                    <div className='row'>
                                        <div className='col-12'>
                                            <div className='card p-4 dark-mode-light-bg'>
                                                <h5 className='dark-mode-text'>Supply Raw Materials</h5>
                                                <form onSubmit={handlerSubmitRMSsupply}>
                                                    <div className='form-group'>
                                                        <label className='dark-mode-text'>Medicine ID</label>
                                                        <input className="form-control" type="text" onChange={handlerChangeID} placeholder="Enter Medicine ID" required />
                                                    </div>
                                                    <div className='form-group'>
                                                        <button className="custom-btn dark-mode-btn btn-md" >Supply</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                )}


                                {ROLE[3] === "manufacturer" && (
                                    <div className='row'>
                                        <div className='col-12'>
                                            <div className='card p-4 dark-mode-light-bg'>
                                                <h5 className='dark-mode-text'>Manufacture</h5>
                                                <form onSubmit={handlerSubmitManufacturing}>
                                                    <div className='form-group'>
                                                        <label className='dark-mode-text'>Medicine ID</label>
                                                        <input className="form-control" type="text" onChange={handlerChangeID} placeholder="Enter Medicine ID" required />
                                                    </div>
                                                    <div className='form-group'>
                                                        <button className="custom-btn dark-mode-btn btn-md" onSubmit={handlerSubmitManufacturing}>Manufacture</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                )}


                                {ROLE[3] === "distributor" && (
                                    <div className='row'>
                                        <div className='col-12'>
                                            <div className='card p-4 dark-mode-light-bg'>
                                                <h5 className='dark-mode-text'>Distribute</h5>
                                                <form onSubmit={handlerSubmitDistribute}>
                                                    <div className='form-group'>
                                                        <label className='dark-mode-text'>Medicine ID</label>
                                                        <input className="form-control" type="text" onChange={handlerChangeID} placeholder="Enter Medicine ID" required />
                                                    </div>
                                                    <div className='form-group'>
                                                        <button className="custom-btn dark-mode-btn btn-md" onSubmit={handlerSubmitDistribute}>Distribute</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {ROLE[3] === "retailer" && (
                                    <div className='row'>
                                        <div className='col-12'>
                                            <div className='card p-4 dark-mode-light-bg'>
                                                <h5 className='dark-mode-text'>Retail</h5>
                                                <form onSubmit={handlerSubmitRetail}>
                                                    <div className='form-group'>
                                                        <label className='dark-mode-text'>Medicine ID</label>
                                                        <input className="form-control" type="text" onChange={handlerChangeID} placeholder="Enter Medicine ID" required />
                                                    </div>
                                                    <div className='form-group'>
                                                        <button className="custom-btn dark-mode-btn btn-md" onSubmit={handlerSubmitRetail}>Retail</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        <div className='col-12 mt-3'>
                                            <div className='card p-4 dark-mode-light-bg'>
                                                <h5 className='dark-mode-text'>Mark as sold</h5>
                                                <form onSubmit={handlerSubmitSold} >
                                                    <div className='form-group'>
                                                        <label className='dark-mode-text'>Medicine ID</label>
                                                        <input className="form-control" type="text" onChange={handlerChangeID} placeholder="Enter Medicine ID" required />
                                                    </div>
                                                    <div className='form-group'>
                                                        <label className='dark-mode-text'>Consumer Name</label>
                                                        <input className="form-control" type="text" onChange={handlerChangeConsumerName} placeholder="Consumer Name" required />
                                                    </div>
                                                    <div className='form-group'>
                                                        <label className='dark-mode-text'>Consumer Phone</label>
                                                        <input className="form-control" type="text" onChange={handlerChangeConsumerPhone} placeholder="Consumer Phone" required />
                                                    </div>
                                                    <div className='form-group'>
                                                        <button className="custom-btn dark-mode-btn btn-md" onSubmit={handlerSubmitSold}>Sold</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            )}

                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default Supply
