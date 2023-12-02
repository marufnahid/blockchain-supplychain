import React, { useState, useEffect, useRef } from 'react'
import Qrcode from 'qrcode.react';
import { useHistory } from "react-router-dom"
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json"
import MedicineInfo from "./MedicineInfo";

function ConsumerTrack() {
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
    const [userID, setuserID] = useState();
    const [RMS, setRMS] = useState();
    const [MAN, setMAN] = useState();
    const [DIS, setDIS] = useState();
    const [RET, setRET] = useState();
    const [ConsumerID, setConsumerID] = useState();
    const [SoldData, setSoldData] = useState({
        name: "",
        phone: ""
    });
    const [QRCodeData, setQRCodeData] = useState({
        consumerName: "",
        consumerPhone: "",
        medicineID: "",
        medicineName: "",
        medicineDescription: "",
        supplierID: "",
        supplierName: "",
        distributorID: "",
        distributorName: "",
        retailerID: "",
        retailerName: "",
    });
    const [TrackTillSold, showTrackTillSold] = useState(false);
    const [TrackTillRetail, showTrackTillRetail] = useState(false);
    const [TrackTillDistribution, showTrackTillDistribution] = useState(false);
    const [TrackTillManufacture, showTrackTillManufacture] = useState(false);
    const [TrackTillRMS, showTrackTillRMS] = useState(false);
    const [TrackTillOrdered, showTrackTillOrdered] = useState(false);

    // const consumerData = {
    //     medicineID: MED[ID]?.id ?? 'N/A',
    //     medicineName: MED[ID]?.name ?? 'N/A',
    //     medicineDescription: MED[ID]?.description ?? 'N/A',
    //     supplierID: RMS[MED[ID]?.RMSid]?.id ?? 'N/A',
    //     supplierName: RMS[MED[ID]?.RMSid]?.name ?? 'N/A',
    //     distributorID: DIS[MED[ID]?.DISid]?.id ?? 'N/A',
    //     distributorName: DIS[MED[ID]?.DISid]?.name ?? 'N/A',
    //     retailerID: RET[MED[ID]?.RETid]?.id ?? 'N/A',
    //     retailerName: RET[MED[ID]?.RETid]?.name ?? 'N/A',
    //     manufactureID: MAN[MED[ID]?.MANid]?.id ?? 'N/A',
    //     manufactureName: MAN[MED[ID]?.MANid]?.name ?? 'N/A',
    //     consumerName: SoldData?.name ?? 'N/A',
    //     consumerPhone: SoldData?.phone ?? 'N/A',
    //   };


    // const jsonData = JSON.stringify(consumerData);



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

            const chainID = await supplychain.methods.findUserByAddress(account).call();
            setuserID(chainID);
            console.log(chainID);

            setSupplyChain(supplychain);
            var i;
            const medCtr = await supplychain.methods.medicineCtr().call();

            const med = {};
            const medStage = [];
            for (i = 0; i < medCtr; i++) {
                med[i + 1] = await supplychain.methods.MedicineStock(i + 1).call();
                medStage[i + 1] = await supplychain.methods.showStage(i + 1).call();
            }
            setMED(med);
            setMedStage(medStage);
            const rmsCtr = await supplychain.methods.rmsCtr().call();
            const rms = {};
            for (i = 0; i < rmsCtr; i++) {
                rms[i + 1] = await supplychain.methods.RMS(i + 1).call();
            }
            setRMS(rms);
            const manCtr = await supplychain.methods.manCtr().call();
            const man = {};
            for (i = 0; i < manCtr; i++) {
                man[i + 1] = await supplychain.methods.MAN(i + 1).call();
            }
            setMAN(man);
            const disCtr = await supplychain.methods.disCtr().call();
            const dis = {};
            for (i = 0; i < disCtr; i++) {
                dis[i + 1] = await supplychain.methods.DIS(i + 1).call();
            }
            setDIS(dis);
            const retCtr = await supplychain.methods.retCtr().call();
            const ret = {};
            for (i = 0; i < retCtr; i++) {
                ret[i + 1] = await supplychain.methods.RET(i + 1).call();
            }
            setRET(ret);

            // const consumerData = await supplychain.methods.getConsumersByRetailer().call();
            // setSoldData(consumerData);
            // console.log(consumerData);

            if (ID) {
                const consumerID = await supplychain.methods.getConsumersByRetailer(RET[MED[ID].RETid].addr).call();
                setConsumerID(consumerID);
            }

            // const consumerID = await supplychain.methods.getConsumersByRetailer(RET[MED[ID].RETid].addr).call();
            //console.log(RET[MED[ID].RETid].addr);

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
    if (TrackTillSold) {
        return (
            <div className="container">
                <div className='medicine-details mt-5 '>
                    <div className='card p-4 m-auto'>
                        <div className='row'>
                            <div className='col-12'>
                                <h3 className='text-center mb-3'>Medicine Details</h3>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-6'>
                                <div className='mb-2 border border-success p-3 rounded'><b>Medicine ID: </b>{MED[ID].id}</div>
                            </div>
                            <div className='col-6'>
                                <div className='mb-2 border border-success p-3 rounded'><b>Name:</b> {MED[ID].name}</div>

                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-12'>
                                <div className='mb-2 border border-success p-3 rounded'><b>Description: </b>{MED[ID].description}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='card mt-4  align-items-center'>
                    <div className='card-body'>
                        <button onClick={() => {
                            showTrackTillSold(false);
                        }} className="btn btn-outline-success btn-md mx-4">Track Another Item</button>

                    </div>
                </div>

                <div className='card mt-4 mb-5'>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-12'>
                                <h3 className='text-center mb-3'>Manufecturing Details</h3>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-4'>
                                <div className='card p-4'>
                                    <h4>Raw Materials Supplier:</h4>
                                    <p><b>Supplier ID: </b>{RMS[MED[ID].RMSid].id}</p>
                                    <p><b>Name:</b> {RMS[MED[ID].RMSid].name}</p>
                                    <p><b>Place: </b>{RMS[MED[ID].RMSid].place}</p>
                                </div>
                            </div>
                            <div className='col-4'>
                                <div className='card p-4'>
                                    <h4>Manufactured by:</h4>
                                    <p><b>Manufacturer ID: </b>{MAN[MED[ID].MANid].id}</p>
                                    <p><b>Name:</b> {MAN[MED[ID].MANid].name}</p>
                                    <p><b>Place: </b>{MAN[MED[ID].MANid].place}</p>
                                </div>
                            </div>
                            <div className='col-4'>
                                <div className='card p-4'>

                                    <h4>Distributed by:</h4>
                                    <p><b>Distributor ID: </b>{DIS[MED[ID].DISid].id}</p>
                                    <p><b>Name:</b> {DIS[MED[ID].DISid].name}</p>
                                    <p><b>Place: </b>{DIS[MED[ID].DISid].place}</p>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-4'>
                            <div className='col-4'>
                                <div className='card p-4'>

                                    <h4>Retailed by:</h4>
                                    <p><b>Retailer ID: </b>{RET[MED[ID].RETid].id}</p>
                                    <p><b>Name:</b> {RET[MED[ID].RETid].name}</p>
                                    <p><b>Place: </b>{RET[MED[ID].RETid].place}</p>
                                </div>
                            </div>
                            <div className='col-4'>
                                <div className='card p-4'>

                                    <h4>Sold by:</h4>
                                    <p><b>Retailer Name: </b>{RET[MED[ID].RETid].name}</p>
                                    <p><b>Customer Name:</b>{SoldData.name} </p>
                                    <p><b>Customer Phone: </b>{SoldData.phone}</p>
                                </div>
                            </div>
                            <div className='col-4'>
                                <div className='card p-4 align-items-center'>
                                    <Qrcode value={QRCodeData} />
                                    <div className='mt-1'>
                                         <p>Scan QR to get manufecturing details</p>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </div >
        )
    }
    if (TrackTillRetail) {
        return (
            <div className="container">
                <div className='medicine-details mt-5 '>
                    <div className='card p-4 m-auto'>
                        <div className='row'>
                            <div className='col-12'>
                                <h3 className='text-center mb-3'>Medicine Details</h3>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-6'>
                                <div className='mb-2 border border-success p-3 rounded'><b>Medicine ID: </b>{MED[ID].id}</div>

                                <div className='mb-2 border border-success p-3 rounded'><b>Current stage: </b>{MedStage[ID]}</div>
                            </div>
                            <div className='col-6'>
                                <div className='mb-2 border border-success p-3 rounded'><b>Name:</b> {MED[ID].name}</div>
                                <div className='mb-2 border border-success p-3 rounded'><b>Description: </b>{MED[ID].description}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='card mt-4 jusitfy-content-center'>
                    <div className='card-body'>
                        <button onClick={() => {
                            history.push('/')
                        }} className="btn btn-outline-danger btn-md mx-4"> HOME</button>
                        <button onClick={() => {
                            showTrackTillRetail(false);
                        }} className="btn btn-outline-success btn-md mx-4">Track Another Item</button>

                    </div>
                </div>

                <div className='card mt-4'>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-6'>
                                <div className='card p-4'>
                                    <h4>Raw Materials Supplier:</h4>
                                    <p><b>Supplier ID: </b>{RMS[MED[ID].RMSid].id}</p>
                                    <p><b>Name:</b> {RMS[MED[ID].RMSid].name}</p>
                                    <p><b>Place: </b>{RMS[MED[ID].RMSid].place}</p>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='card p-4'>
                                    <h4>Manufactured by:</h4>
                                    <p><b>Manufacturer ID: </b>{MAN[MED[ID].MANid].id}</p>
                                    <p><b>Name:</b> {MAN[MED[ID].MANid].name}</p>
                                    <p><b>Place: </b>{MAN[MED[ID].MANid].place}</p>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-4'>
                            <div className='col-6'>
                                <div className='card p-4'>

                                    <h4>Distributed by:</h4>
                                    <p><b>Distributor ID: </b>{DIS[MED[ID].DISid].id}</p>
                                    <p><b>Name:</b> {DIS[MED[ID].DISid].name}</p>
                                    <p><b>Place: </b>{DIS[MED[ID].DISid].place}</p>
                                </div>
                            </div>

                            <div className='col-6'>
                                <div className='card p-4'>

                                    <h4>Retailed by:</h4>
                                    <p><b>Retailer ID: </b>{RET[MED[ID].RETid].id}</p>
                                    <p><b>Name:</b> {RET[MED[ID].RETid].name}</p>
                                    <p><b>Place: </b>{RET[MED[ID].RETid].place}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        )
    }
    if (TrackTillDistribution) {
        return (
            <div className="container">
                <div className='medicine-details mt-5 '>
                    <div className='card p-4 m-auto'>
                        <div className='row'>
                            <div className='col-12'>
                                <h3 className='text-center mb-3'>Medicine Details</h3>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-6'>
                                <div className='mb-2 border border-success p-3 rounded'><b>Medicine ID: </b>{MED[ID].id}</div>

                                <div className='mb-2 border border-success p-3 rounded'><b>Current stage: </b>{MedStage[ID]}</div>
                            </div>
                            <div className='col-6'>
                                <div className='mb-2 border border-success p-3 rounded'><b>Name:</b> {MED[ID].name}</div>
                                <div className='mb-2 border border-success p-3 rounded'><b>Description: </b>{MED[ID].description}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='card mt-4 jusitfy-content-center'>
                    <div className='card-body'>
                        <button onClick={() => {
                            history.push('/')
                        }} className="btn btn-outline-danger btn-md mx-4"> HOME</button>
                        <button onClick={() => {
                            showTrackTillDistribution(false);
                        }} className="btn btn-outline-success btn-md mx-4">Track Another Item</button>

                    </div>
                </div>

                <div className='card mt-4'>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-4'>
                                <div className='card p-4'>
                                    <h4>Raw Materials Supplier:</h4>
                                    <p><b>Supplier ID: </b>{RMS[MED[ID].RMSid].id}</p>
                                    <p><b>Name:</b> {RMS[MED[ID].RMSid].name}</p>
                                    <p><b>Place: </b>{RMS[MED[ID].RMSid].place}</p>
                                </div>
                            </div>
                            <div className='col-4'>
                                <div className='card p-4'>
                                    <h4>Manufactured by:</h4>
                                    <p><b>Manufacturer ID: </b>{MAN[MED[ID].MANid].id}</p>
                                    <p><b>Name:</b> {MAN[MED[ID].MANid].name}</p>
                                    <p><b>Place: </b>{MAN[MED[ID].MANid].place}</p>
                                </div>
                            </div>
                            <div className='col-4'>
                                <div className='card p-4'>

                                    <h4>Distributed by:</h4>
                                    <p><b>Distributor ID: </b>{DIS[MED[ID].DISid].id}</p>
                                    <p><b>Name:</b> {DIS[MED[ID].DISid].name}</p>
                                    <p><b>Place: </b>{DIS[MED[ID].DISid].place}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
    if (TrackTillManufacture) {
        return (
            <div className="container">
                <div className='medicine-details mt-5 '>
                    <div className='card p-4 m-auto'>
                        <div className='row'>
                            <div className='col-12'>
                                <h3 className='text-center mb-3'>Medicine Details</h3>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-6'>
                                <div className='mb-2 border border-success p-3 rounded'><b>Medicine ID: </b>{MED[ID].id}</div>

                                <div className='mb-2 border border-success p-3 rounded'><b>Current stage: </b>{MedStage[ID]}</div>
                            </div>
                            <div className='col-6'>
                                <div className='mb-2 border border-success p-3 rounded'><b>Name:</b> {MED[ID].name}</div>
                                <div className='mb-2 border border-success p-3 rounded'><b>Description: </b>{MED[ID].description}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='card mt-4 jusitfy-content-center'>
                    <div className='card-body'>
                        <button onClick={() => {
                            history.push('/')
                        }} className="btn btn-outline-danger btn-md mx-4"> HOME</button>
                        <button onClick={() => {
                            showTrackTillManufacture(false);
                        }} className="btn btn-outline-success btn-md mx-4">Track Another Item</button>

                    </div>
                </div>

                <div className='card mt-4'>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-6'>
                                <div className='card p-4'>
                                    <h4>Raw Materials Supplier:</h4>
                                    <p><b>Supplier ID: </b>{RMS[MED[ID].RMSid].id}</p>
                                    <p><b>Name:</b> {RMS[MED[ID].RMSid].name}</p>
                                    <p><b>Place: </b>{RMS[MED[ID].RMSid].place}</p>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='card p-4'>
                                    <h4>Manufactured by:</h4>
                                    <p><b>Manufacturer ID: </b>{MAN[MED[ID].MANid].id}</p>
                                    <p><b>Name:</b> {MAN[MED[ID].MANid].name}</p>
                                    <p><b>Place: </b>{MAN[MED[ID].MANid].place}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
    if (TrackTillRMS) {
        return (
            <div className="container">
                <div className='medicine-details mt-5 '>
                    <div className='card p-4 m-auto'>
                        <div className='row'>
                            <div className='col-12'>
                                <h3 className='text-center mb-3'>Medicine Details</h3>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-6'>
                                <div className='mb-2 border border-success p-3 rounded'><b>Medicine ID: </b>{MED[ID].id}</div>

                                <div className='mb-2 border border-success p-3 rounded'><b>Current stage: </b>{MedStage[ID]}</div>
                            </div>
                            <div className='col-6'>
                                <div className='mb-2 border border-success p-3 rounded'><b>Name:</b> {MED[ID].name}</div>
                                <div className='mb-2 border border-success p-3 rounded'><b>Description: </b>{MED[ID].description}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='card mt-4 jusitfy-content-center'>
                    <div className='card-body'>
                        <button onClick={() => {
                            history.push('/')
                        }} className="btn btn-outline-danger btn-md mx-4"> HOME</button>
                        <button onClick={() => {
                            showTrackTillRMS(false);
                        }} className="btn btn-outline-success btn-md mx-4">Track Another Item</button>

                    </div>
                </div>

                <div className='card mt-4'>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-md-6 offset-md-3'>
                                <div className='card p-4'>
                                    <h4>Raw Materials Supplier:</h4>
                                    <p><b>Supplier ID: </b>{RMS[MED[ID].RMSid].id}</p>
                                    <p><b>Name:</b> {RMS[MED[ID].RMSid].name}</p>
                                    <p><b>Place: </b>{RMS[MED[ID].RMSid].place}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div >
        )
    }
    if (TrackTillOrdered) {
        return (
            <div className="container mt-5">

                <div className='card'>
                    <div className='d-flex justify-content-center px-3 top' >
                        <h3>Track Medicine</h3>
                    </div>
                </div>
                <MedicineInfo medicine={MED[ID]} />

                <button onClick={() => {
                    showTrackTillOrdered(false);
                }} className="btn btn-outline-success btn-sm">Track Another Item</button>
                <span onClick={() => {
                    history.push('/')
                }} className="btn btn-outline-danger btn-sm"> HOME</span>

                {/* <section className="row">
                    
                    <article className="col-3">
                        <h4><u>Raw Materials Supplied by:</u></h4>
                        <p><b>Supplier ID: </b>{RMS[MED[ID].RMSid].id}</p>
                        <p><b>Name:</b> {RMS[MED[ID].RMSid].name}</p>
                        <p><b>Place: </b>{RMS[MED[ID].RMSid].place}</p>
                    </article>
                </section> */}
            </div >
        )
    }
    const handlerChangeID = (event) => {
        setID(event.target.value);
    }
    const redirect_to_home = () => {
        history.push('/home')
    }
    const handlerSubmit = async (event) => {
        event.preventDefault();
        var ctr = await SupplyChain.methods.medicineCtr().call();
        if (!((ID > 0) && (ID <= ctr))) {
            alert("Invalid Medicine ID!!!");
        }
        else {

            const consumerID = await SupplyChain.methods.getConsumersByRetailer(RET[MED[ID].RETid].addr).call();



            SupplyChain.methods.getConsumer(consumerID[0]).call().then((consumer) => {

                setSoldData({
                    name: consumer.consumerName,
                    phone: consumer.consumerPhone
                })

                // const consu = {
                //     consumerName: consumer.consumerName,
                //     consumerPhone: consumer.consumerPhone,
                //     medicineID: MED[ID].id,
                //     medicineName: MED[ID].name,
                //     medicineDescription: MED[ID].description,
                //     supplierID: RMS[MED[ID].RMSid].id,
                //     supplierName: RMS[MED[ID].RMSid].name,
                //     distributorID: DIS[MED[ID].DISid].id,
                //     distributorName: DIS[MED[ID].DISid].name,
                //     retailerID: RET[MED[ID].RETid].id,
                //     retailerName: RET[MED[ID].RETid].name,
                // };

                // const res =

                const data = {
                    consumerName: consumer.consumerName,
                    consumerPhone: consumer.consumerPhone,
                    medicineID: MED[ID].id,
                    medicineName: MED[ID].name,
                    medicineDescription: MED[ID].description,
                    supplierID: RMS[MED[ID].RMSid].id,
                    supplierName: RMS[MED[ID].RMSid].name,
                    distributorID: DIS[MED[ID].DISid].id,
                    distributorName: DIS[MED[ID].DISid].name,
                    retailerID: RET[MED[ID].RETid].id,
                    retailerName: RET[MED[ID].RETid].name,
                };

                // Convert the object to a JSON string
                const jsonString = JSON.stringify(data);

                // Set the JSON string to the state
                setQRCodeData(jsonString);

                // setQRCodeData({
                //     consumerName: consumer.consumerName,
                //     consumerPhone: consumer.consumerPhone,
                //     medicineID: MED[ID].id,
                //     medicineName: MED[ID].name,
                //     medicineDescription: MED[ID].description,
                //     supplierID: RMS[MED[ID].RMSid].id,
                //     supplierName: RMS[MED[ID].RMSid].name,
                //     distributorID: DIS[MED[ID].DISid].id,
                //     distributorName: DIS[MED[ID].DISid].name,
                //     retailerID: RET[MED[ID].RETid].id,
                //     retailerName: RET[MED[ID].RETid].name,
                // })
            }
            )

            // console.log(SoldData);

            // eslint-disable-next-line
            if (MED[ID].stage == 5)
                showTrackTillSold(true);
            // eslint-disable-next-line
            else if (MED[ID].stage == 4)
                showTrackTillRetail(true);
            // eslint-disable-next-line
            else if (MED[ID].stage == 3)
                showTrackTillDistribution(true);
            // eslint-disable-next-line
            else if (MED[ID].stage == 2)
                showTrackTillManufacture(true);
            // eslint-disable-next-line
            else if (MED[ID].stage == 1)
                showTrackTillRMS(true);
            else
                showTrackTillOrdered(true);

        }

    }

    const redirect_to_back = () => {
        history.goBack()
    }

    const copyToClipboard = () => {
        inputRef.current.select();
        document.execCommand('copy');
        alert('Address copied to clipboard!');
    };

    return (
        <div>
            <div className='container'>
                <div className="row align-items-center vh-100">
                    <div className="col-sm-12">
                        <div className='row'>
                            <div className='col-md-6 offset-md-3'>
                                <h3 className='text-center mb-3'>Track Medicine</h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 offset-md-3">
                                <div className="card p-4 my-4">


                                    <form onSubmit={handlerSubmit} className='m-auto'>
                                        <div className='form-row align-items-center'>
                                            <div className="col-auto my-1">
                                                <h6 className='text-center'>Enter Medicine ID to Track it</h6>
                                            </div>
                                        </div>
                                        <div className="form-row align-items-center">

                                            <div className="col-auto my-1">
                                                <label className="mr-sm-2" htmlFor="inlineFormInputName">Medicine ID</label>
                                                <input type="text" className="form-control" id="inlineFormInputName" onChange={handlerChangeID} placeholder="Enter Medicine ID" required />
                                            </div>

                                            <div className="col-auto my-1 align-self-end">
                                                <button type="submit" className="btn btn-primary" onSubmit={handlerSubmit}>Track</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConsumerTrack
