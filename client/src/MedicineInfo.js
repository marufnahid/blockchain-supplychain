// MedicineInfo.js
import React from 'react';

function MedicineInfo({ medicine }) {
    let currentStageText;

    // Use a switch statement to determine the current stage text based on the stage value
    switch (medicine.stage) {
      case 0:
        currentStageText = 'Ordered';
        break;
      case 1:
        currentStageText = 'Manufacturer';
        break;
      default:
        currentStageText = medicine.stage; // Display the actual stage value for other cases
    }
    if(medicine.stage === 0){
        console.log("zero");
    }
    console.log(medicine.stage);

    return (
        <div className="wrap mt-5">
            <div className="card p-4 box-shadow">
                <div className="row d-flex justify-content-between px-3 top border-bottom">
                    <div className="d-flex">
                        <h5>
                            Order
                            <span className="text-white fornt-weight-bold">#{medicine.id}</span>
                        </h5>
                    </div>
                    <div className="d-flex flex-column text-sm-right">
                        <p className="mb-0">
                            <span className=" font-weight-bold">Date: </span>
                            <span>12/12/2012</span>
                        </p>
                        <p className="mb-1">
                            <span className=" font-weight-bold">ID: </span>
                            <span>123456</span>
                        </p>

                    </div>
                </div>
                <div className="row justify-content-center text-center">
                    <div>
                        <div className="icon-content text-left">
                            <p className="font-weight-bold  pt-1">Product Name: <span className="text-red">{medicine.name}</span>
                            </p>
                            <p className="text-"><span className="text-weight-bold">Type:</span>{medicine.description}
                            </p>
                        </div>
                        <div className="order-status">
                            <h3 className="text-red">{currentStageText}</h3>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default MedicineInfo;
