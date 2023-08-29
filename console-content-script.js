/*
 * Check regularly until the required div renders on the page.
 * When it does, fetch the AWS Account Name from extension's local storage and add a new <div> to the menu
 */
let isAcctDetailsRendered = setInterval(() => {
  if (document.querySelector('div[data-testid="account-detail-menu"]')) {
    const acctDetailsContainerDiv = document.querySelector('div[data-testid="account-detail-menu"]')?.firstChild;  

    chrome.storage.local.get(["awsAccountName"], (result) => {
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