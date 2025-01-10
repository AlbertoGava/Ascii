let img;
let font;
let size = 8;
let gap = 3;
let lets = ['.'];

let params = {
    size: size,
    gap: gap,
    text: 'INPUT',
    letterColor: '#000000',
    backgroundColor: '#FFFFFF',
    sensitivity: 110,
    rotateLetters: false,
    rotationMin: -45,
    rotationMax: 45,
    uploadFile: function() {
        document.getElementById('fileInput').click();
    },
    uploadFont: function() {
        document.getElementById('fontInput').click();
    },
    saveImage: function() {
        saveCanvas('ascii', 'png');
    }
};

let letsIndex = 0;

function preload() {
    img = loadImage("imgs/INPUT.jpg");
    font = loadFont('fonts/RobotoFlex[GRAD,XOPQ,XTRA,YOPQ,YTAS,YTDE,YTFI,YTLC,YTUC,opsz,slnt,wdth,wght].ttf');
}

function setup() {
    createCanvas(3968, 4894);

    textFont(font);
    img.loadPixels();

    var gui = new dat.GUI();
    gui.add(params, 'uploadFont').name('FONT');
    gui.add(params, 'uploadFile').name('UPLOAD IMAGE');
    let dimension = gui.addFolder("GRID");
    dimension.add(params, 'size', 1, 20).name('Size').onChange(redrawCanvas);
    dimension.add(params, 'gap', 1, 20).name('Spacing').onChange(redrawCanvas);
    let letters = gui.addFolder("TEXT");
    letters.add(params, 'text').name('Text').onFinishChange(updateLetters);
    letters.add(params, 'sensitivity', 5, 200).name('Sensitivity').onChange(redrawCanvas);
    let colours = gui.addFolder("COLORS");
    colours.addColor(params, 'letterColor').name('Letter').onChange(redrawCanvas);
    colours.addColor(params, 'backgroundColor').name('Background').onChange(redrawCanvas);
    let rotationFolder = gui.addFolder("ROTATION");
    rotationFolder.add(params, 'rotateLetters').name('Rotate Letters').onChange(redrawCanvas);
    rotationFolder.add(params, 'rotationMin', -90, 0).name('Rotation Min').onChange(redrawCanvas);
    rotationFolder.add(params, 'rotationMax', 0, 90).name('Rotation Max').onChange(redrawCanvas);
    gui.add(params, 'saveImage').name('SAVE .PNG');

    let fileInput = createFileInput(handleFile);
    fileInput.id('fileInput');
    fileInput.style('display', 'none');

    let fontInput = createFileInput(handleFont);
    fontInput.id('fontInput');
    fontInput.style('display', 'none');

    redrawCanvas();
}

function draw() {
    noLoop();
}

function redrawCanvas() {
    background(params.backgroundColor);

    letsIndex = 0;
    textSize(params.size);
    textAlign(CENTER, CENTER);
    fill(params.letterColor);

    for (let y = 0; y < height; y += params.size + params.gap) {
        for (let x = 0; x < width; x += params.size + params.gap) {
            let imgX = floor(map(x, 0, width, 0, img.width));
            let imgY = floor(map(y, 0, height, 0, img.height));
            let imgIndex = (imgY * img.width + imgX) * 4;

            let pixelColor = color(img.pixels[imgIndex], img.pixels[imgIndex + 1], img.pixels[imgIndex + 2]);
            let brightnessValue = brightness(pixelColor);

            let sizeValue = map(brightnessValue, 0, 255, 0, params.sensitivity);

            textSize(sizeValue);

            push();
            translate(x, y);

            if (params.rotateLetters) {
                let randomRotation = random(params.rotationMin, params.rotationMax);
                rotate(radians(randomRotation));
            }

            text(lets[letsIndex], 0, 0);
            pop();

            letsIndex++;
            if (letsIndex >= lets.length) {
                letsIndex = 0;
            }
        }
    }
}

function updateLetters() {
    lets = params.text.split('');
    letsIndex = 0;
    redrawCanvas();
}

function handleFile(file) {
    if (file.type === 'image') {
        img = loadImage(file.data, () => {
            img.loadPixels();
            resizeCanvas(img.width, img.height);
            redrawCanvas();
        });
    } else {
        console.log('File non supportato');
    }
}

function handleFont(file) {
    if (file.type === 'font') {
        font = loadFont(file.data, () => {
            textFont(font);
            redrawCanvas();
        });
    } else {
        console.log('File non supportato');
    }
}
