/* Downloads transcripts to txt */

async function fetchTranscript(user, job) {
  const fileName = `${ job } (${ user }).txt`;

  const res = await fetch(`${ window.location.protocol }//${ window.location.hostname }/api?user=${ user }&job=${ job }`);
  const transcript = await res.text();
  const transcriptBlob = await new Blob([transcript], { type: 'text/plain' });

  // Create a hidden link.
  const downloadLink = document.createElement('a');

  // Set the download file name.
  downloadLink.download = fileName;

  // Text can be anything because it's not shown to the user.
  downloadLink.innerHTML = 'My Hidden Download Link';

  // We want to remove the download link once we're done.
  downloadLink.onclick = e => document.body.removeChild(e.target);

  // Set the URL to the transcript blob.
  downloadLink.href = window.URL.createObjectURL(transcriptBlob);

  // Make sure download link is never shown to user.
  downloadLink.style.display = 'none';

  // Append it to the document.
  document.body.appendChild(downloadLink);

  // "Click" on the download link.
  downloadLink.click();

  return transcript;
}

export { fetchTranscript };
