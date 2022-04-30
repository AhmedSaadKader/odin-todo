import './style.css';
console.log('sdflkj');

function component() {
    const element = document.createElement('div');
   const btn = document.createElement('button');
 
    element.innerHTML = 'Hellos';
 
   btn.innerHTML = 'Click me and check the console!';
   btn.onclick = printMe;
 
   element.appendChild(btn);
 
    return element;
  }
 
  document.body.appendChild(component());