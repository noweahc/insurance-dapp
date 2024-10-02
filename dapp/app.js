let provider;
let signer;
let contract;

const contractAddress = "0x701B8b98a44AcFbaA8406F9d97003866280fF01d";  // 배포된 스마트 계약 주소
const contractABI = [
    {
        "inputs": [],
        "name": "approveClaim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "executePayment",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_insured",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "_contractDetails",
                "type": "string"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "claimApproved",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contractDetails",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "insured",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "insurer",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// MetaMask 연결 함수
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        await ethereum.request({ method: 'eth_requestAccounts' });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log('Wallet connected:', await signer.getAddress());
    } else {
        console.log('MetaMask not found');
    }
}

// 보험 청구 승인 함수 호출
async function approveClaim() {
    try {
        const tx = await contract.approveClaim();
        await tx.wait();
        console.log('Claim approved');
    } catch (error) {
        console.log('Error approving claim:', error);
    }
}

// 보험금 지급 함수 호출
async function executePayment() {
    try {
        const tx = await contract.executePayment({ value: ethers.utils.parseEther("0.1") });
        await tx.wait();
        console.log('Payment executed');
    } catch (error) {
        console.log('Error executing payment:', error);
    }
}

// 보험 계약서 생성 함수 (Flask API 호출)
async function generateInsuranceContract() {
    const customerData = {
        name: "John Doe",
        age: 35,
        insurance_type: "Life Insurance"
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/generate-contract', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ customer_data: customerData })
        });

        const data = await response.json();
        console.log('Generated Contract:', data.contract);
        document.getElementById('contractResult').innerText = data.contract;
    } catch (error) {
        console.error('Error generating contract:', error);
    }
}

// 버튼 클릭 이벤트 연결
document.getElementById('connectWallet').onclick = connectWallet;
document.getElementById('approveClaim').onclick = approveClaim;
document.getElementById('executePayment').onclick = executePayment;
document.getElementById('generateContract').onclick = generateInsuranceContract;
