onmessage = async function(e) {
  console.log('Worker: Message received from main script');
  
  const response = await fetch('https://api.thecatapi.com/v1/images/search');
  const cat = await response.json();

  postMessage(cat);
}