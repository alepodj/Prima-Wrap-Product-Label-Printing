//Note from the author:
//---------------------
//Hello this is the creator, if are reading this code im glad you made it this far.
//This application is nothing short of awesome so i hope you enjoy it. An expert im
//not but with passion i write, will the code be clean? sure as much as i can, will
//it be functional, thats my goal. In any case, any questions, dont ask :)
//Cheers 

//Technical:
//----------
//This app is built with python eel https://github.com/python-eel/Eel a very nifty library
//that allows non C++ programers like me do simple but pretty built desktop applications that
//rely on good old HTML5/CSS3/Javascript/Python3.

//----------------------------------------------------------
//                           Imports
//----------------------------------------------------------
//Zpl code for images
import {fragile, defective, clear, topSeller, hotSale, bulk} from './zpl_images.js'

//Once document load and only then...lol jquery
$(document).ready(() => {

//----------------------------------------------------------
//                           Globals
//----------------------------------------------------------
//Initialize the holder variable for the global data from python/excel/database(future)
let DB;

//jQuery pointers and references used thruout the code, to save memory im told, so sure why not.
let barcode = $('#barcode'),
    bulkImg = $('#bulk'),
    calibrateMedia = $('#calibrate-media'),
    configurePrinter = $('#configure-printer'),
    customZpl = $('#custom-zpl'),
    defectiveImg = $('#defective'),
    description = $('#description'),
    expertInput = $('#expert'),
    feedOneLabel = $('#feed-one-label'),
    fragileImg = $('#fragile'),
    hotSaleImg = $('#hot-sale'),
    help = $('#help'),
    hr = $('hr'),
    imageLabel = $('#image-label'),
    labelType = $('#label-type'),
    loadFactoryDefaults = $('#load-factory-defaults'),
    main = $('#main'),
    mainBottom = $('#main-bottom'),
    manualZpl = $('#manual-zpl'),
    message = $('#message'),
    mode = $('#mode'),
    part = $('#part'),
    partSearch = $('#part-search'),
    printButton = $('#print'),
    printConfigLabel = $('#print-configuration-label'),
    printer = $('#printer'),
    clearImg = $('#clear'),
    quantity = $('#quantity'),
    quantityContainer = $('#quantity-container'),
    resetPrinter = $('#reset-printer'),
    retail = $('#retail'),
    settings = $('#settings'),
    spinner = $('#spinner'),
    topSellerImg = $('#top-seller'),
    wholesale = $('#wholesale'),
    zplArea = $('#zpl-area');

//Disable Context Menu, not cause im evil but cause its a desktop app or at least i want to make believe and this one of the ways to do so
// $(document).on('contextmenu', e => e.preventDefault());

//Disable F keys
$(document).keydown((e) => {  
    e = (e || window.e);  
    if (e.keyCode == 112) {  
        return false;  
    } else if(e.keyCode == 113) {
        return false; 
    } else if(e.keyCode == 114) {
        return false; 
    } else if(e.keyCode == 115) {
        return false; 
    } else if(e.keyCode == 117) {
        return false; 
    } else if(e.keyCode == 118) {
        return false; 
    } else if(e.keyCode == 119) {
        return false; 
    } else if(e.keyCode == 120) {
        return false; 
    } else if(e.keyCode == 121) {
        return false; 
    } else if(e.keyCode == 122) {
        return false; 
    } 
    // else if(e.keyCode == 123) {
    //     return false; 
    // }
});  


//----------------------------------------------------------
//                           Events
//----------------------------------------------------------

//Part number search event, with additional check in case the user forgets something needs to typed first in order to be searched later
partSearch.click(() => {

    //Disable button until search completes
    partSearch.prop('disabled', true);

    //Check if user provided any data at all
    if(!part.val().trim()) {

        //Alert user to add something to the field
        part.addClass('border-danger placeholder-danger font-weight-bold font-italic glow');

        //Enable button to reset function
        partSearch.prop('disabled', false);

        //Clear any previous data
        description.attr('placeholder', '...');
        description.val('');
        part.val('');
        retail.attr('placeholder', '...');
        retail.val('');
        wholesale.attr('placeholder', '...');
        wholesale.val('');

        return;
    }

    //Populate data from DB into the app fields
    search();

});  

//Final print button event, the culmination of all your hardwork, the moment of truth where the label(s) come rushing out...or not. Life is hard lol
printButton.click(() => {
    if (zplArea.is(':visible')) {
        customPrint(
            manualZpl.val().trim(),
            quantity.val().trim()
        )
    } else {
        print(
            part.val().trim(),
            description.val().trim(),
            retail.val().trim(),
            wholesale.val().trim(),
            quantity.val().trim()
        );
    }
});

//Enable expert or basic mode for the application, what is expert or basic mode u ask? Hint hint, this is an event, go find the function :P
expertInput.change(() => {
    if (expertInput.is(':checked')) {
        expert();
    } else {
        basic();
    }
});

//User can choose a barcode type that matches their needs
barcode.change(() => {
    if (barcode.is(':checked')) {
        datamatrix();
    } else {
        code128();
    }
});

//Show and hide, smoothly while we are it, the custom ZPL mode of the application
customZpl.click(() => {
    if (mainBottom.is(':visible')) {
        barcode.prop('disabled', true);
        expertInput.prop('disabled', true);
        mainBottom.fadeOut(1);
        printButton.prop('disabled', false);
        zplArea.fadeIn(250);
    } else {
        barcode.prop('disabled', false);
        expertInput.prop('disabled', false);
        mainBottom.fadeIn(250);
        printButton.prop('disabled', false);
        zplArea.fadeOut(1);
    }
});

//Allow the user to select their own image for printing
imageLabel.change(() => {

    //Selected file name
    $('#zpl-area label').text(imageLabel.val().replace(/C:\\fakepath\\/i, ''));

    //Get the list of available printers
    const getZpl = async () => { 
        //Return a promise from the python funtion call which will return an object with zpl
        return await eel.image_to_zpl(imageLabel.val().replace(/C:\\fakepath\\/i, ''))();
    };

    //Catch the ZPL data promise
    let zpl = getZpl();

    //Once promise is fulfilled, get the data to user zpl manual form
    zpl.then(zplData => {

        //If no ZPL was generated wanr the user something went wrong or the image is at the wrong spot
        if(!zplData) {
            manualZpl.val('');
            manualZpl.attr('placeholder', 'ZPL couldnt be generated or selected file is not in the appropiate location: \n\n - ..\\web\\assets\\custom\\..');
            manualZpl.addClass('border-danger placeholder-danger font-weight-bold font-italic glow');
            return;
        }
        
        //Auto generated ZPL has the tendency to autoconfirgure the printer in RAM, and change things like print mode which breaks the current labels
        //Corrent print mode
        zplData = zplData.replace('MMC,Y', '^MMT,N')

        //Remove user warning
        manualZpl.removeClass('border-danger placeholder-danger font-weight-bold font-italic glow');

        //Assigned generated ZPL to textarea
        manualZpl.val(zplData);

    }).catch((error) => {

        //Log errors to console
        console.log(error);
        console.log('No ZPL generated or image path not found');
    });
    
})

//Remove classes added to warn user of not entering anything on the part number info and searches
part.focus(() => {
    part.removeClass('border-danger placeholder-danger font-weight-bold font-italic glow');
});

//Remove classes added to warn user of not entering anything on the part number info and searches
description.focus(() => {
    description.removeClass('border-danger placeholder-danger font-weight-bold font-italic glow');
});

//Remove classes added to warn user of not entering anything on the part number info and searches
retail.focus(() => {
    retail.removeClass('border-danger placeholder-danger font-weight-bold font-italic glow');
});

//Remove classes added to warn user of not entering anything on the part number info and searches
wholesale.focus(() => {
    wholesale.removeClass('border-danger placeholder-danger font-weight-bold font-italic glow');
});

//Remove classes added to warn user of not entering anything on the manual zpl field
manualZpl.focus(() => {
    manualZpl.removeClass('border-danger placeholder-danger font-weight-bold font-italic glow');
});

//Click event to load fragile image ZPL
fragileImg.on('click', () =>{
    manualZpl.removeClass('border-danger placeholder-danger font-weight-bold font-italic glow');
    manualZpl.val(fragile);
});

//Click event to load defective image ZPL
defectiveImg.on('click', () =>{
    manualZpl.removeClass('border-danger placeholder-danger font-weight-bold font-italic glow');
    manualZpl.val(defective);
});

//Click event to load clear image ZPL
clearImg.on('click', () =>{
    manualZpl.removeClass('border-danger placeholder-danger font-weight-bold font-italic glow');
    manualZpl.val(clear);
});

//Click event to load top-seller image ZPL
topSellerImg.on('click', () =>{
    manualZpl.removeClass('border-danger placeholder-danger font-weight-bold font-italic glow');
    manualZpl.val(topSeller);
});

//Click event to load hot-sale image ZPL
hotSaleImg.on('click', () =>{
    manualZpl.removeClass('border-danger placeholder-danger font-weight-bold font-italic glow');
    manualZpl.val(hotSale);
});

//Click event to load bulk image ZPL
bulkImg.on('click', () =>{
    manualZpl.removeClass('border-danger placeholder-danger font-weight-bold font-italic glow');
    manualZpl.val(bulk);
});

//Guide tour trigger and setup. Help users navigate and understand the application
help.click(()=> {

    if (zplArea.is(':visible')) {
        customZpl.click();
    }

    introJs().setOptions({
        showProgress: true,
        disableInteraction: true,
        steps: [
            {
                element: document.querySelector('.jumbotron'),
                title: 'Welcome!',
                intro: 'Welcome to <b>Prima Wrap Product Label Printing Software</b>. Continue this quick simple guide to learn how to use this application.',
            },
            {
                element: document.querySelector('#printer'),
                title: 'Printer Selection',
                intro: 'The 1st step and the most important is in order to enable more functionality, a <b>Printer</b> must be selected.',
            },
            {
                element: document.querySelector('#intro-expert'),
                title: 'Mode Selection',
                intro: 'An attempt is made to simplify the app usage by automating selections. In <b>Basic Mode</b> the application relies on the use of Prima Wrap product database to fill in the data for you. In the event the database is not available, by flipin to <b>Expert Mode</b>, users can continue using the app and enter information manually.',
                position: 'left'
            },
            {
                element: document.querySelector('#intro-barcode'),
                title: 'Barcode Type',
                intro: 'Depending on the lenth of the content, users may elect to switch between 2 different type of barcode printing to fit the label, either, <b>Code128</b> that offers a barcode that focuses on the length of the label, or <b>DataMatrix</b> which offers a more compressed squared shaped barcode.',
                position: 'left'
            },
            {
                element: document.querySelector('#custom-zpl'),
                title: 'Custom ZPL',
                intro: 'Advanced users have the ability to enter custom <b>ZPLII</b> code to print directly, or select images to print directly from the computer.',
                position: 'left'
            },
            {
                element: document.querySelector('#settings'),
                title: 'Settings',
                intro: 'Users are able to certain extent, reset, configure and setup the printer in the settings menu',
                position: 'left'
            },
            {
                element: document.querySelector('#help'),
                title: 'Help',
                intro: 'This tour is available anytime using this icon',
                position: 'left'
            },
            {
                element: document.querySelector('#part'),
                title: 'Part Number',
                intro: 'This field requires a Part Number to be entered. If Prima Wrap database is available a choices drop down will show up allowing the user to make a selection or ultimatelly continue typing.',
                position: 'left'
            },
            {
                element: document.querySelector('#part-search'),
                title: 'Search',
                intro: 'The search button will be available when the Prima Wrap database is accessible to automate the population of the fields below.',
                position: 'left'
            },
            {
                title: 'Fields',
                intro: 'The rest of the fields are self explanatory based on their labels and relate to data for the Part Number selected, that were either populated automatically from Prima Wrap database or manually entered by the user.',
            },
            {
                element: document.querySelector('#print'),
                title: 'Print Label',
                intro: 'Finally, the print out with the output selected on the previous fields, with any errors or missing data being presented to the user before proceeding',
                position: 'top'
            },
            {
                title: 'Done',
                intro: 'Thanks for completing the user guide, dont hesitate to go thru again as needed and any questions beyond whats presented, please contact site management. <br><br>Thanks',
            },
        ]
      }).start();

      introJs().addHints();
})

//Setting menu options

//Calibrate the media
calibrateMedia.click(()=> {
    let zpl = ` ~JC
                ^XA
                ^CF0,80
                ^FO40,160
                ^FDMedia Calibrated^FS
                ^XZ`;
    settingsPrint(zpl, 1);
})

//Print the printer current config
printConfigLabel.click(()=> {
    let zpl = '~WC';
    settingsPrint(zpl, 1);
})

//Print a test label
feedOneLabel.click(()=> {
    let zpl = ` ^XA
                ^CF0,80
                ^FO130,160
                ^FDLabel Test^FS
                ^XZ`;
    settingsPrint(zpl, 1);
})

//Load the printer factory default settings
loadFactoryDefaults.click(()=> {
    let zpl = ` ^XA
                ^CF0,80
                ^FO70,160
                ^FDFactory Default^FS
                ^JUF
                ^XZ`;
    settingsPrint(zpl, 1);
})

//Hard reset, hardware reset the printer, mix of reboot with DRAM clearning, very intrusive
resetPrinter.click(()=> {
    let zpl = ` ^XA
                ^CF0,80
                ^FO100,160
                ^FDPrinter Reset^FS
                ^XZ
                ~JR`;
    settingsPrint(zpl, 1);
})

//Configure the printer to the current custome label size 2x1.25 inch
configurePrinter.click(()=> {
    let zpl = ` ~SD24~TA000~JSA^XA^SZ2^MNW^PW608^LL390^PON^PR4,4^PMN^LS0^MTD^MMT,N^MPE^XZ^XA^JUS^XZ 
                ^XA
                ^CF0,80
                ^FO5,160
                ^FDPrinter Configured^FS
                ^XZ`;
    settingsPrint(zpl, 1);
})


//----------------------------------------------------------
//                           Utility
//----------------------------------------------------------

//Search key in DB object of a given value, yes no i got it from the internet and im 80% getting how it works, i know it will return the key of the given value passed as argument
//i think its the inner arrow function that trips me, Long Live StackOverflow!
const getDatabaseKey = (obj, value) => {
    return Object.keys(obj).find(key => obj[key] == value);
};

//Detect length of description textarea field and adjust font size dynamically based on length, this will definitely make it easy on eyes on long text
const textLength = (e, l) => {
    if(l <= 50) {
        e.css('font-size', '100%');
    } else if (l >= 51 && l < 70) {
        e.css('font-size', '90%');
    } else {
        e.css('font-size', '75%');
    }
};

//Application basic mode, restricts most field to minimize user errors, remove the options to shoot themselves in the foot!
const basic = () => {
    description.prop('disabled', true);
    part.prop('disabled', false);
    partSearch.prop('disabled', false);
    retail.prop('disabled', true);
    wholesale.prop('disabled', true);

    //If Part Number field has no value disable print, there is nothing print anyways why the trouble
    if(!part.val().trim()) {
        printButton.prop('disabled', true);
    }
    
    description.attr('placeholder', '...');
    mode.text('Basic');
    retail.attr('placeholder', '...');
    wholesale.attr('placeholder', '...');
};

//Application expert mode, no really enable all fields let hell loose and off course enable the options to shoot themselves in the foot again, i did want you!
const expert = (db = 1) => {
    description.attr('placeholder', 'Enter information manually...');
    description.prop('disabled', false);
    expertInput.prop('checked', true);
    mode.text('Expert');
    part.attr('placeholder', 'Enter information manually...');
    part.prop('disabled', false);
    printButton.prop('disabled', false);
    retail.attr('placeholder', 'Enter information manually...');
    retail.prop('disabled', false);
    wholesale.attr('placeholder', 'Enter information manually...');
    wholesale.prop('disabled', false);

    if (!db) {
        printButton.prop('disabled', true);
    }

    //Keypress event for adjusting textarea font size automatically
    description.bind('keyup blur paste', () => {
        textLength(description, description.val().length);
    });
};

//Update checkbox text with Code128
const code128 = () => {
    labelType.text('Code128');
};

//Update checkbox text with DataMatrix
const datamatrix = () => {
    labelType.text('DataMatrix');
};



//----------------------------------------------------------
//                          PRINT
//----------------------------------------------------------

//Settings and configurations to be sent to printer
const settingsPrint = zpl => {
    
    //Finally send that desired print that the user has been working so hard for
    eel.send_label(zpl, printer.find(":selected").text(), 1)();
};

//Some smart users will want to do things manually like creating and printing their own ZPL, so here it is
const customPrint = (zpl, itemQuantity) => {
    
    //Default value for print quantity
    itemQuantity = itemQuantity || '1';

    if(!zpl) {
        //Remind the user enter something to print as we cannot print nothing at all :facepalm:
        manualZpl.val('');
        manualZpl.addClass('border-danger placeholder-danger font-weight-bold font-italic glow');
        return;
    }

    //Finally send that desired print that the user has been working so hard for
    eel.send_label(zpl, printer.find(":selected").text(), itemQuantity)();
};

//The print function TA DAAAA!!! Finally the culmination of all the clicking and searching around
const print = (partNumber, itemDescription, itemRetail, itemWholesale, itemQuantity) => {

    //Default value for quntity of labels if not provided is 1, lets not waste paper and save the environment
    itemQuantity = itemQuantity || '1';

    //Send error to user to enter a part number
    if (!partNumber) {
        part.val('');
        part.attr('placeholder', 'Enter Item Part Number...');
        part.addClass('border-danger placeholder-danger font-weight-bold font-italic glow');
        return;
    } else {
        part.removeClass('border-danger placeholder-danger font-weight-bold font-italic glow');
    }

    //Send error to user to enter a description
    if (!itemDescription) {
        description.val('');
        description.attr('placeholder', 'Enter Item Description...');
        description.addClass('border-danger placeholder-danger font-weight-bold font-italic glow');
        return;
    } else {
        description.removeClass('border-danger placeholder-danger font-weight-bold font-italic glow');
    }

    //Send error to user to enter a retail price
    if (!itemRetail) {
        retail.val('');
        retail.attr('placeholder', 'Enter Item Retail Price...');
        retail.addClass('border-danger placeholder-danger font-weight-bold font-italic glow');
        return;
    } else {
        retail.removeClass('border-danger placeholder-danger font-weight-bold font-italic glow');
    }

    //Send error to user to enter a wholesale price
    if (!itemWholesale) {
        wholesale.val('');
        wholesale.attr('placeholder', 'Enter Item Wholesale Price...');
        wholesale.addClass('border-danger placeholder-danger font-weight-bold font-italic glow');
        return;
    } else {
        wholesale.removeClass('border-danger placeholder-danger font-weight-bold font-italic glow');
    }

    //Remove excess spaces from description and cuts it down if its more than 90 chars
    if(itemDescription.length < 90) {
        itemDescription = itemDescription.replace(/  +/g, ' ');
    } else {
        itemDescription = `${itemDescription.replace(/  +/g, ' ').substring(0, 90)}...`;
    }

    //Add $ sing to retail and add .00 if not already
    if (itemRetail.includes('.')) {
        itemRetail = `$${itemRetail}`;
    } else {
        itemRetail = `$${itemRetail}.00`;
    }

    //Remove dot from wholesale value and add # infront or add 00 at the end if no dot
    if (itemWholesale.includes('.')) {
        itemWholesale = `#${itemWholesale.split('.').join('')}`;
    } else {
        itemWholesale = `#${itemWholesale}00`;
    }

    //Code128 specific correction for barcode size based on length 
    let barcodeSize = 2;

    if(partNumber.length > 15) {
        barcodeSize =  1;
    }

    zpl_code128 = `
        ^XA

        ^FX 1st section with bar code.
        ^BY${barcodeSize},2.0,60
        ^FO15,20
        ^BCN,,N,,,A
        ^FD${partNumber}
        ^FS
        
        ^FX 2nd section with barcode description
        ^CF0,50
        ^FO20,90
        ^FB570,2,0,L,0
        ^FD${partNumber}
        ^FS
        
        ^FX 3rd section with item detail
        ^CFD,40
        ^FO20,140
        ^FB570,7,0,C,0
        ^FD${itemDescription}
        ^FS
        
        ^FX 4th section with prices
        ^CF0,50
        ^FO20,335
        ^FB290,1,0,L,0
        ^FD${itemWholesale}^FS
        ^FO290,335
        ^FB290,1,0,R,0
        ^FD${itemRetail}^FS
        ^FS
        
        ^FX 5th section company logo
        ^FO220,340^GFA,513,513,19,gWF,:::::FC03E00F0C3FC7E1JFE1F1F0807FC3F00FF,FC00E0070C3F87E0JFE1E0F0801F83F003F,FC0060030C1F87C0KF0E0F1800F81F001F,FC3821C10C0F07C07JF0E0E1870781F0E0F,FC3C21E10C0F07807JF0C061878700F0F0F,FC3C21E10C0607847JF84063878700F0F0F,FC3821C10C04078C3JF8404387061870E0F,FC0060030CI070C3JF80403800E187001F,FC00E0070C2047001JFC0407801C003003F,FC03E0070C20C6001JFC0E07801C00300FF,FC3FE1870C30C61E0JFC0E0786180030IF,FC3FE1C30C39C43F0JFE0E0F87087E10IF,FC3FE1E10C3FC03F87IFE1F0F87007E10IF,gWF,:::::::
        ^FS
        
        ^XZ
    `;
    
    //DataMatrix specific correction for barcode text size based on length
    let barcodeTextSize = 50;

    if(partNumber.length > 16) {
        barcodeTextSize =  40;
    }

    zpl_datamatrix = `
        ^XA

        ^FX 1st section with bar code.
        ^BY1,3,120
        ^FO20,25
        ^BX,,200,,,
        ^FD${partNumber}
        ^FS

        ^FX 2nd section with barcode description
        ^CF0,${barcodeTextSize}
        ^FO140,25^GB455,108,3^FS
        ^FO140,60
        ^FB450,1,0,C,0
        ^FD${partNumber}
        ^FS

        ^FX 3rd section with item detail
        ^CFD,40
        ^FO20,150
        ^FB570,7,0,C,0
        ^FD${itemDescription}
        ^FS

        ^FX 4th section with prices
        ^CF0,50
        ^FO20,335
        ^FB290,1,0,L,0
        ^FD${itemWholesale}^FS
        ^FO290,335
        ^FB290,1,0,R,0
        ^FD${itemRetail}^FS
        ^FS

        ^FX 5th section company logo
        ^FO220,340^GFA,513,513,19,gWF,:::::FC03E00F0C3FC7E1JFE1F1F0807FC3F00FF,FC00E0070C3F87E0JFE1E0F0801F83F003F,FC0060030C1F87C0KF0E0F1800F81F001F,FC3821C10C0F07C07JF0E0E1870781F0E0F,FC3C21E10C0F07807JF0C061878700F0F0F,FC3C21E10C0607847JF84063878700F0F0F,FC3821C10C04078C3JF8404387061870E0F,FC0060030CI070C3JF80403800E187001F,FC00E0070C2047001JFC0407801C003003F,FC03E0070C20C6001JFC0E07801C00300FF,FC3FE1870C30C61E0JFC0E0786180030IF,FC3FE1C30C39C43F0JFE0E0F87087E10IF,FC3FE1E10C3FC03F87IFE1F0F87007E10IF,gWF,:::::::
        ^FS

        ^XZ
    `;
    
    ////Finally send that desired print that the user has been working so hard for with either type of barcode selected code128 or datamatrix the user chooses not me!
    if (labelType.text() === 'Code128' ){
        eel.send_label(zpl_code128, printer.find(":selected").text(), itemQuantity)();
    } else {
        eel.send_label(zpl_datamatrix, printer.find(":selected").text(), itemQuantity)();
    }
};



//----------------------------------------------------------
//                          Search
//----------------------------------------------------------
//The main flow of the application after the initial checks have been passed or met
const search = () => {

    //How to explain this one? DB object consists of an object of 4 objects where the key:value pairs of each one relates to the other 3 in order
    //so the key 1 of object 1 has data that relates to the key 1 of the other 3. Knowing this, by having a key we can 4 different values from 4
    //different objects which data is related. Hope i explained that right otherwise, go read a book!
    let targetKey = getDatabaseKey(DB.Item, part.val().trim());
    
    //Target Key not found or not in DB, user messed up or it actually doesnt exist
    if (!targetKey) {

        //Enable expert mode to allow the user to manually control the flow, you are on your own here!
        expert();

        //Enable search again for user to retry, no retry no fun
        partSearch.prop('disabled', false);

        //Warn the user data hasnt been found and need to manually input and to PAY ATTENTION PLEASE!
        description.attr('placeholder', 'Enter information manually...');
        description.val('');
        retail.attr('placeholder', 'Enter information manually...');
        retail.val('');
        wholesale.attr('placeholder', 'Enter information manually...');
        wholesale.val('');

        return;
    }

    //Adjust the size of the description based on the text length for better user experience otherwise the text area can get overwhelming 
    textLength(description, DB['Description'][targetKey].length);

    //Target key found then populate all corresponding fields
    description.val(DB['Description'][targetKey]);
    retail.val(DB['RETAIL 3 Price'][targetKey]);
    wholesale.val(DB['Price'][targetKey]);

    //Enable print label button and search again ability
    partSearch.prop('disabled', false);
    printButton.prop('disabled', false);
};



//----------------------------------------------------------
//                         DATABASE
//----------------------------------------------------------

//If and only if printers are available in the current system, attempt to load the database as best effort otherwise resort to manual entries
const getDatabase = async () => { 
    //Return a promise from the python funtion call which will return an object with database info
    let database = await eel.get_database()(); 

    //Database not found or in the incorrect folder, wanr the user of the mistake or error   
    if(!database) {

        //Alert the user in beautifull manner i might add of their mistake or error
        Swal.fire({
            icon: 'error',
            title: 'No Database Found',
            html: 'Make sure the database excel file is anywhere on the <b>/web/db/*.xlsx/</b> folder and subfolders and try again, otherwise the application will default to <b>Expert or Manual mode only</b>!',
            confirmButtonText:'Understood!',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
                }
            }).then(()=> {
                
            //Send the user the concerning root folder the should have the 1 database in
                eel.open_folder()(); 
    
                //Enable expert mode as is a database is technically not require for the application to function    
                expert(0);
            })
            return;
    }

    //Mutliple databases found, as it cannot be garanteed which one is the latest, wanr the user of the issue and provide a list of all databases found for manual resolution
    if(database[0] === 1) {

        //Initialize and unordered list to create a list of databases for the user to delete
        let list = '<ul class="list-group">';

        //Loop overall found databases and complete the list
        database[1].forEach((value, index, array)=> {
            list = list + `<li class="list-group-item">${value}</li>`;
            if(index = array.length - 1) {
                list = list + '</ul>';
            }
        })

        //Alert the user in beautifull manner i might add of their mistake or error
        Swal.fire({
            icon: 'error',
            title: 'Multiple Databases Found',
            html: `Make sure to have only a single excel database file in any of the application subfolders. Check the <b>/web/db/*.xlsx/</b> folder and its subfolders and delete unnecesary excel files <b>*.xlsx</b>, see list below, otherwise the application will default to <b>Expert or Manual mode only</b>!<br><br>${list}`,
            confirmButtonText:'Understood!',
            showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
        }).then(() => {
            
            //Send the user the concerning root folder the should have the 1 database in
            eel.open_folder()();  

            //Enable expert mode as is a database is technically not require for the application to function  
            expert(0);
        })
        return;
    }

    //...If a proper single database is found then...
    //Enable search automcomple as the user types, recommendations will be send, fancy stuff i know
    part.autocomplete({
        source: database[1],
        minLength: 2,
    })

    //Assign part number data from local excel to the global DB object, this data came from the backend
    DB = JSON.parse(database[0]);
}



//----------------------------------------------------------
//                         PRINTERS
//----------------------------------------------------------

//Begin the whole application flow after all other events, utility and flow related functions are loaded lexically correct i think?
//The printers is the application Go/NoGo point so we starting by finding if there are any in the system, otherwise wanr the user and close the app
//If so, then load them and move on to try and get the database, which is not a make ir or break it step as the users can always manually type the info
//Knowing this app uses ZPL one could argue that if a ZPL supporting printer is bit detected we can close it, but some funtionality can be seen or used without so
(async () => { 

    //Return a promise from the python funtion call which will return an object with list of printers
    let printers = await eel.get_printers()();

    //1st Mandatory Check
    //Worse case scenario if the data from the backend returns anything but a printer list throw everything out and go home 
    if (!printers) {
        //Log errors to console
        console.log('No Printer Detected');

        //Message and warn the user of the impending DOOM!
        message.text('No Printers Detected. Application will shutdown in 10sec');

        //Close the application because what else to do ¯\_(ツ)_/¯ i give up! Call Support!
        eel.close_app()();
    }

    //Initialize the options with a default value
    let option = '<option value="Select a printer from the list to continue" selected>Select a printer from the list to continue</option>';

    //Loop thru all the printers available in the system and populate even more options
    for (let i=0; i < printers.length; i++){
        option += `<option value="${printers[i]}">${printers[i]}</option>`;
    }

    //Add the printer list to the options list
    printer.append(option);

    //2nd Mandatory Check
    //If no printers loaded or dont exist in the system the application cannot continue, return, throw error and close the application
    if ($('#printer option').length === 1 && $('#printer option').val() === 'Select a printer from the list to continue') {
        
        //Message and warn the user of the impending D(.)(.)M!
        message.text('No Printers Detected. Application will shutdown in 10sec')
        
        //Close the application because what else to do ¯\_(ツ)_/¯ i give up! Call Support!
        eel.close_app()();

        return;
    }

    //Fade out spinner and fade in body content for cuteness overload
    spinner.fadeOut(1);
    main.fadeIn(250);
    quantityContainer.fadeIn(250);
    printButton.fadeIn(250);
    hr.fadeIn(250);

    //On printer selection change enable Part Number Search and other nice to have and visuals
    printer.change(() => {
        if (printer.text() !== 'Select a printer from the list to continue') {
            $("#printer option[value='Select a printer from the list to continue']").remove();
            barcode.prop('disabled', false);
            customZpl.prop('disabled', false);
            expertInput.prop('disabled', false);
            settings.prop('disabled', false);
            part.attr('placeholder', 'Enter Item Part Number...');
            part.prop('disabled', false);
            partSearch.prop('disabled', false);
            printButton.prop('disabled', false);
            quantity.prop('disabled', false);
        }
    });

    //Printer processing completed successfully then call database resource and attemp to fetch data
    getDatabase();

})();

//---------------------
//End of Document ready
//---------------------
});