const inputSlider = document.querySelector('[data-lengthSlider]')
const lengthDisplay = document.querySelector('[data-lengthNumber]')
const passwordDisplay = document.querySelector('[data-passwordDispaly]')
const copyBtn = document.querySelector('.copyBtn')
const copyMsg = document.querySelector('[data-copyMsg]')
const uppercaseCheck = document.querySelector('#upperCase')
const lowercasrCheck = document.querySelector('#lowerCase')
const numberCheck = document.querySelector('#numbers')
const symobolsCheck = document.querySelector('#symbols')
const indicator = document.querySelector('[data-indicator]')
const genrateBtn = document.querySelector('.genrateBtn')
const checkBox = document.querySelector('input[type=che]')
const allCheckBox = document.querySelectorAll('input[type=checkbox]')

const symbols = '~`!@#$%^&*()_-+=[{]};:"\|,<.>/?'

let password = ""
let passwordLength = 10
let checkCount = 0
// set strength color to grey
handleSlider()

// set password length
function handleSlider() {
    inputSlider.value = passwordLength
    lengthDisplay.innerHTML = passwordLength

}

function setIndicator(color) {
    indicator.style.backgroundColor = color
    //shadow
    indicator.style.boxShadow = `0 0 12px 1px ${color}`
}
setIndicator("#ccc")

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

function genrateRandomNumber() {
    return getRndInteger(0, 9)
}
function genrateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123))
}
function genrateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91))
}

function genrateSymbolCase() {
    const randNum = getRndInteger(0, symbols.length)
    return symbols.charAt(randNum)
}

function calcStrength() {
    let hasUpper = false
    let hasLower = false
    let hasNum = false
    let hasSym = false
    if (uppercaseCheck.checked) hasUpper = true
    if (lowercasrCheck.checked) hasLower = true
    if (numberCheck.checked) hasNum = true
    if (symobolsCheck.checked) hasSym = true

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) 
        {
        setIndicator('#0f0')
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator('#ff0')
    }
    else {
        setIndicator('#f00')
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText = 'copied'
    }
    catch (e) {
        copyMsg.innerText = 'failed'
    }
    //to make cpy wala tag visible 
    copyMsg.classList.add('active')

    setTimeout(() => {
        copyMsg.classList.remove('active')

    }, 2000);

}
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++
        console.log('checkbox'+checkCount)
        }
    })

    //special condition 
    if(passwordLength<checkCount){
        passwordLength=checkCount 
        handleSlider()
    }
}

function shufflePassword(array){
    //fisher yates method
    for(let i = array.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1))
        const temp = array[i]
        array[i]=array[j]
        array[j]= temp
    }
    let str = ""
    array.forEach((el)=>(str+=el))
    return str

}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange)
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value
    handleSlider()
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent()
    }
})

genrateBtn.addEventListener('click',()=>{
    if(checkCount<=0) return

    if(passwordLength<checkCount){
        passwordLength=checkCount
        handleSlider()
    }

    //lets start the main point of genrating password
    //remove old password
     password=""

    // if(uppercaseCheck.checked){
    //     password+= genrateUpperCase();
    // }
    // if(lowercasrCheck.checked){
    //     password+= genrateLowerCase();
    // }
    // if(numberCheck.checked){
    //     password+= genrateRandomNumber();
    // }
    // if(symobolsCheck.checked){
    //     password+= genrateSymbolCase();
    // }
    let funArr = []
    if(uppercaseCheck.checked){
        funArr.push(genrateUpperCase)
    }
    if(lowercasrCheck.checked){
        funArr.push(genrateLowerCase)
    }
    if(numberCheck.checked){
        funArr.push(genrateRandomNumber)
    }
    if(symobolsCheck.checked){
        funArr.push(genrateSymbolCase)
    }
    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]()
        
    }
    for(let i=0; i<passwordLength-funArr.length;i++){
        let randIndex = getRndInteger(0,funArr.length)
       
        password+=funArr[randIndex]()
    }
    //shuffle
    password=shufflePassword(Array.from(password))

    passwordDisplay.value=password
    //cal strengt
    calcStrength()


})