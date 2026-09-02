// Frontend application logic.
// Firebase functions are loaded from firebase.js when configuration is added.

let selectedPayment = "bKash";
let appData = {
  username: "@username",
  telegramId: "123456789",
  balance: 0,
  status: "INACTIVE",
  currentPlan: "No Active Plan",
  adsLimit: 0,
  adsRemaining: 0
};

function initTelegram(){
  if(window.Telegram && Telegram.WebApp){
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    const user = Telegram.WebApp.initDataUnsafe?.user;
    if(user){
      appData.username = user.username ? "@"+user.username : "@"+(user.first_name || "user");
      appData.telegramId = String(user.id);
    }
  }
  renderData();
}

function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0,0);
}

function renderData(){
  const balance = "$" + Number(appData.balance).toFixed(2);
  homeUsername.textContent = appData.username;
  homeTelegramId.textContent = appData.telegramId;
  profileUsername.textContent = appData.username;
  profileTelegramId.textContent = appData.telegramId;
  homeBalance.textContent = balance;
  walletBalance.textContent = balance;
  homePlan.textContent = appData.currentPlan;
  profilePlan.textContent = appData.currentPlan;
  homeAds.textContent = `${appData.adsRemaining} / ${appData.adsLimit} Remaining`;
}

function selectPayment(method){
  selectedPayment = method;
  document.querySelectorAll(".payment").forEach(x=>x.classList.remove("selected"));
  document.getElementById(method === "bKash" ? "bkashBtn" : "nagadBtn").classList.add("selected");
}

async function submitDeposit(){
  const amount = Number(document.getElementById("depositAmount").value);
  const transactionId = document.getElementById("transactionId").value.trim();

  if(!amount || amount <= 0) return toast("Please enter a valid USD amount.");
  if(!transactionId) return toast("Please enter your Transaction ID.");

  const request = {
    amount,
    transactionId,
    paymentMethod: selectedPayment,
    status: "PENDING",
    createdAt: new Date().toISOString()
  };

  // If Firebase is configured, this function stores a PENDING request only.
  if(window.createDepositRequest){
    try{
      await window.createDepositRequest(request);
      toast("Deposit request submitted for admin verification.");
    }catch(e){
      toast("Firebase error: " + e.message);
    }
  } else {
    console.log("Demo deposit request:", request);
    toast("Demo mode: request created. Add Firebase config to save it.");
  }

  document.getElementById("transactionId").value = "";
}

function purchasePlan(name, price, days, ads){
  if(Number(appData.balance) < price){
    return toast(`Insufficient wallet balance. You need $${price.toFixed(2)}.`);
  }

  // In production this must be handled by secure Firebase Cloud Functions/admin backend.
  appData.balance -= price;
  appData.status = "ACTIVE";
  appData.currentPlan = name;
  appData.adsLimit = ads;
  appData.adsRemaining = ads;
  renderData();
  toast(`${name} plan selected in demo mode.`);
}

function withdrawRequest(){
  toast("Withdrawal requests should be connected to an admin approval system.");
}

function showHistory(){
  toast("Transaction History screen can be added next.");
}

function showAdsInfo(){
  toast("Ads are available according to your active plan.");
}

function toast(message){
  const el=document.getElementById("toast");
  el.textContent=message;
  el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),3000);
}

initTelegram();
