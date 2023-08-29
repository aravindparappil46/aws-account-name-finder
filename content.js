
/**
 * Captures the AWS account name by listening to clicks on the SSO account selection page
 * When user clicks on the "Management Console" link under an AWS account name, the name is stored to 
 * the Extension's local storage (different from the website's local storage)
 */
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("profile-link")) {
    const href = event.target.getAttribute("href");
    const accountNameToDisplay = extractAccountNameFromHref(href);
    chrome.storage.local.set({ awsAccountName: accountNameToDisplay });
  }
});

/*
 * Check regularly until the required div renders on the page.
 * When it does, fetch the AWS Account Name from extension's local storage and add a new <div> to the menu
 */
let isAcctDetailsRendered = setInterval(function () {
  if (document.querySelector('div[data-testid="account-detail-menu"]')) {
    const acctDetailsContainerDiv = document.querySelector('div[data-testid="account-detail-menu"]')?.firstChild;  

    chrome.storage.local.get(["awsAccountName"], function (result) {
      const awsAccountName = result.awsAccountName;
      if (awsAccountName) {
        const accountNameElement = createHTMLToDisplay(awsAccountName);
        acctDetailsContainerDiv.insertBefore(accountNameElement, acctDetailsContainerDiv.firstChild);
      }
    });

    clearInterval(isAcctDetailsRendered);
  }
}, 100);


// ------------------- Util Functions ------------------------- //

/**
 * Extracts the AWS account name from the href of the <a> clicked. The href for "Management Console" link on the SSO page is of the format:
 * "https://myorg.awsapps.com/start/#/saml/custom/123456789%20%28My-AWS-Account-Name-HERE%29/d00SomeWeirdHashHere0008a%3D%3D"
 */
function extractAccountNameFromHref(href) {
  const start = href.indexOf('%28') + 3;
  const end = href.indexOf('%29');

  if (start !== -1 && end !== -1) {
    return href.substring(start, end);
  }
  return null;
}

function createHTMLToDisplay(text) {
  const div = document.createElement('div');
  const labelSpan = document.createElement('span');
  const accountNameSpan = document.createElement('span');

  labelSpan.innerText = 'Account Name: ';
  accountNameSpan.innerText = text;

  div.id = 'acct-name-from-extension';
  div.appendChild(labelSpan);
  div.appendChild(accountNameSpan);
  return div;
}