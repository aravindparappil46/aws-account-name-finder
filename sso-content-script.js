/**
 * Captures the AWS account name by listening to clicks on the SSO account selection page.
 * When user clicks on the "Management Console" link under an AWS account panel, the name is stored to 
 * the Extension's local storage (different from the website's local storage)
 */
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("profile-link")) {
    const href = event.target.getAttribute("href");
    const accountNameToDisplay = extractAccountNameFromHref(href);
    chrome.storage.local.set({ awsAccountName: accountNameToDisplay });
  }
});

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