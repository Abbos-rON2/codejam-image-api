const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const searchSumbit = document.querySelector('#search_submit');
const searchInput = document.querySelector('#search');
const myCheck = document.querySelector('#myCheck')
let state = {
    tool: 'Pencil',
    size: 4,
    color: '#000000',
    isMouseDown: false,
    grayScale: false,
}
myCheck.addEventListener('change', () => {
    if (myCheck.checked) {
        state.grayScale = true;
    } else {
        state.grayScale = false;
    }
})
canvas.addEventListener('mousedown', (e) => {
    state.isMouseDown = true;
    draw(e);
})
canvas.addEventListener('mouseover', () => state.isMouseDown = false)
canvas.addEventListener('mouseup', () => state.isMouseDown = false)
canvas.addEventListener('mousemove', (e) => draw(e))
searchSumbit.addEventListener('click', () => {
    getLinkToImage(searchInput.value);
});
window.addEventListener('unload', () => {
    localStorage.setItem('canvasState', canvas.toDataURL());
});

window.addEventListener('load', () => {
    //Drawing image from localStorage on canvas
    const canvasImage = new Image();
    canvasImage.src = localStorage.getItem('canvasImage');
    if (state.grayScale === true) {
        ctx.globalCompositeOperation = 'luminosity';
    }else{
        ctx.globalCompositeOperation = 'source-over';
    }
    canvasImage.onload = () => {

        ctx.drawImage(canvasImage, 0, (512 - canvasImage.height) / 2);
    }

    // Drawing canvas state
    const canvasState = new Image();
    canvasState.src = localStorage.getItem('canvasState');
    canvasState.onload = () => ctx.drawImage(canvasState, 0, 0);
});


document.querySelector('.size-switcher').addEventListener('click', (e) => {
    console.log(e)
    switch (e.target.innerHTML) {
        case '128x128':
            state.size = 4;
            break;
        case '256x256':
            state.size = 2;
            break;
        case '512x512':
            state.size = 1;
            break;
        default:
            break;
    }
})

function draw(e) {
    const x = Math.abs(Math.floor(e.layerX / state.size));
    const y = Math.abs(Math.floor(e.layerY / state.size));
    if (state.isMouseDown && e.button === 0 && state.tool === 'Pencil') {
        ctx.fillStyle = state.color;
        ctx.fillRect(x * state.size, y * state.size, state.size, state.size);
    }
}
// Color Picker ///

const prevPicker = document.querySelector('.color.color-prev');
const currentPicker = document.querySelector('.color.color-current');
const redPicker = document.querySelector('.color.color-red');
const bluePicker = document.querySelector('.color.color-blue');

redPicker.addEventListener('click', (e) => {
    e.preventDefault();
    state.color = redPicker.value;
    currentPicker.value = redPicker.value;
});
bluePicker.addEventListener('click', (e) => {
    e.preventDefault();
    state.color = bluePicker.value;
    currentPicker.value = bluePicker.value;

});

currentPicker.addEventListener('change', (e) => {
    prevPicker.value = state.color;
    state.color = e.target.value;
    currentPicker.value = state.color
});
prevPicker.addEventListener('click', (e) => {
    e.preventDefault();
    state.color = prevPicker.value;
    prevPicker.value = currentPicker.value;
    currentPicker.value = state.color;
});

// Clear ///
function clear() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function selectTool(e) {
    if (e.target.innerText !== 'Clear') {
        tool = e.target.innerText;
        document.querySelectorAll('.setting .menu-item').forEach((element) => {
            element.classList.remove('active');
        });
        if (e.target.parentElement.classList.contains('setting')) {
            e.target.classList.add('active');
        }
    }
}
// Tools State ///
document.querySelector('#clear').addEventListener('click', clear);
document.querySelector('.setting').addEventListener('click', (e) => {
    selectTool(e);
});


function getBase64Image(img) {
    const canv = document.createElement('canvas');
    canv.width = img.width;
    canv.height = img.height;

    canv.getContext('2d').drawImage(img, 0, 0);
    canv.crossOrigin = 'Anonymous';
    const dataURL = canv.toDataURL();

    return dataURL;
}

function getLinkToImage(cityName) {
    fetch(`https://api.unsplash.com/search/photos?page=1&query=${cityName}&client_id=8aea7752039b2b66d7e43567716f506535de385691b0a582fc0886b42c3750be`)
        .then((data) => data.json())
        .then((data) => {
            const imgLink = data.results[0].urls.small.replace('w=400', 'w=512');
            const img = new Image();
            img.src = imgLink;
            img.crossOrigin = 'Anonymous';
            if (state.grayScale === true) {
                ctx.globalCompositeOperation = 'luminosity';
            }else{
                ctx.globalCompositeOperation = 'source-over';
            }
            img.onload = () => {
                ctx.drawImage(img, 0, (512 - img.height) / 2);
                localStorage.setItem('canvasImage', getBase64Image(img));
            };
        });
}