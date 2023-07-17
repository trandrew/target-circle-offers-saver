async function collecOffers() {
  // Show banner
  document.getElementById('__next').innerHTML += `
  <div id="target-offer-collector-banner">
    <button id="target-offer-collector-close">x</button>
    <span>Target Circle Offer Saver is currently running on this page.</span> <br>
    <span id="target-offer-banner-content"></span> <br>
  </div>
  <style>
    #target-offer-collector-close {
      float: right;
      display: inline-block;
      padding: 0 10px 0 0;
    }

    #target-offer-collector-banner {
      position: sticky;
      bottom: 0;
      background-color: #006fcf;
      padding-top: 20px;
      color: white;
      width: 100%;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      z-index: 99999;
    }
    
    #target-offer-collector-banner a, #target-offer-collector-banner #cta-content {
      border-radius: 100px;
      cursor: pointer;
      display: inline-block;
      font-family: CerebriSans-Regular,-apple-system,system-ui,Roboto,sans-serif;
      padding: 7px 20px;
      text-align: center;
      text-decoration: none;
      transition: all 250ms;
      border: 0;
      font-size: 16px;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
    }
    
    #target-offer-collector-banner .center {
      margin: auto;
      width: 50%;
      padding: 10px;
      text-align: center;
    }
    
    #target-offer-collector-banner a#target-offer-collector-bug {
      background-color: #d1320a;
      box-shadow: rgba(241, 7, 7, 0.2) 0 -25px 18px -14px inset,rgba(241, 7, 7, .15) 0 1px 2px,rgba(241, 7, 7, .15) 0 2px 4px,rgba(241, 7, 7, .15) 0 4px 8px,rgba(241, 7, 7, .15) 0 8px 16px,rgba(241, 7, 7, .15) 0 16px 32px;
      color: white;
      margin-top: 10px;
    }
    
    #target-offer-collector-banner a#target-offer-collector-bug:hover {
      box-shadow: rgba(241, 7, 7, .35) 0 -25px 18px -14px inset,rgba(241, 7, 7, .25) 0 1px 2px,rgba(241, 7, 7,.25) 0 2px 4px,rgba(241, 7, 7,.25) 0 4px 8px,rgba(241, 7, 7,.25) 0 8px 16px,rgba(241, 7, 7,.25) 0 16px 32px;
      transform: scale(1.05) rotate(-1deg);
    }
  </style>
  `;

  document.getElementById('target-offer-collector-banner').innerHTML += `<a id='target-offer-collector-bug' class="btn btn-primary" href="https://airtable.com/shrko65ccCW6fo8BZ" target="_blank" rel="noopener noreferrer" role="button">Report Bug</a> <br></br>`;
  document.getElementById('target-offer-banner-content').innerText = `Getting things ready ...`;
 
  // attach event handler for close button
  document.getElementById('target-offer-collector-close').onclick = function(){
    this.parentNode.remove();
    return false;
  };

  await new Promise(r => setTimeout(r, 4000));

  var offerButtons = Array.from(document.getElementsByClassName("cuamvm")).filter(div => div.textContent == "Save offer");
  console.log(offerButtons);
  var index;
  for (index = 0; index < offerButtons.length; ++index) {
    document.getElementById('target-offer-banner-content').innerText = `${index} offers collected`;
    console.log(index);
    console.log(offerButtons[index]);
    offerButtons[index].click();
    

    await new Promise(r => setTimeout(r, 1000));
  }

  document.getElementById('target-offer-banner-content').innerText = `All available offers collected! =)\nPlease refresh the page to remove this banner.`;
}

chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes('https://www.target.com/circle/offers')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: collecOffers
    });
  } else if (tab.url.includes('https://www.target.com')) {
    chrome.tabs.update({
      url: 'https://www.target.com/circle/offers'
    }, function (currentTab) {
      var listener = function(tabId, changeInfo, tab) {
        if (tabId == currentTab.id && changeInfo.status === 'complete') {
          // remove listener, so only run once
          chrome.tabs.onUpdated.removeListener(listener);
          // do stuff
          chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            function: collecOffers
          });
        }
      }
      chrome.tabs.onUpdated.addListener(listener);
    });
  }
});
