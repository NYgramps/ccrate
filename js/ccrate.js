/*
*      Script Variables and Constant Definitions
*/

"use strict";

var newline;
if (navigator.appVersion.search(/Win/) > -1)
  {
  newline = "\r\n";
  }
else if (navigator.appVersion.search(/X11|Linux|Mac/) > -1)
  {
  newline = "\n";
  }
else
  {
  alert("FATAL: unknown operating system");
  close();
  }

const TOL     = 1.e-8,
      MAXITER = 250,
      COLORS  = {"red"         : "rgb(255,0,0)",
                 "forestgreen" : "rgb(34,139,34)",
                 "gold"        : "rgb(255,215,0)",
                 "navyblue"    : "rgb(0,0,128)",
                 "lightgray"   : "rgb(211,211,211)",
                 "darkgray"    : "rgb(169,169,169)",
                },
      POPUP = 
{
"help1":
"The list of all deposits and withdrawals associated with the account, that is, the transaction history,"   + newline +
"is stored in a file in which each row describes a single transaction as:"                                  + newline +
"                                   transaction date,transaction amount"                                    + newline +
"where the two data values are separated by a comma; such a file is said to have csv (comma"                + newline +
"separated value) format.  The list need not be in any particular chronological order.  When opened"        + newline +
"in any modern spreadsheet program, the list itself can be viewed as a spreadsheet, making"                 + newline +
"adjustments to the list easy to perform.  After editing is complete, the modified spreadsheet is saved"    + newline +
"as a csv file, usually with the same name, and now contains all the changes made to the transaction"       + newline +
"history by the user.  Dates have the format 'yyyymmdd', where 'yyyy' is the year, 'mm' is the number"      + newline +
"of the month, between 01 and 12, inclusive, and 'dd' is the number of the day of the month, between"       + newline +
"01 and 31,inclusive.  The format of an amount consists only of digits, with no commas; the decimal"        + newline +
"portion is optional.  Withdrawals must be preceded by a minus sign; a plus sign is optional for"           + newline +
"deposits.",
"help2":
"This input box is programmatically filled with the date of the oldest, or first, transaction occurring"    + newline +
"in the list of transactions, that is, in the csv file.  This date begins the time interval over which"     + newline +
"the continuously compounded rate, aka ccrate, is to be computed.  It is a very good approximation"         + newline +
"of rates compounded at least as frequently as monthly, but is easier to work with because of its"          + newline +
"mathematical definition.",
"help3":
"This input box requires the user to input the ending date of the time interval over which the rate is"     + newline +
"to be computed.  Therefore it must occur after the date of the earliest transaction, that is, the"         + newline +
"oldest transaction in the csv history file.",
"help4":
"This input box requires the user to input the value of the account on the date entered as the end"         + newline +
"date of the time interval.  Its format must consist principally of digits, without any commas"             + newline +
"or monetary symbols, such as a dollar sign.  A decimal portion is optional, as is a preceding plus"        + newline +
"sign.  The type of account under consideration probably never has a negative value, so that is a"          + newline +
"moot consideration.",
};


main();

/*    - - - - - - - - - - - - - - - - - - - - - - - - - -    */

function main()
  {                            
  let trans = [];

  let ids = {"browse"  : document.getElementById("browse"),
             "begin"   : document.getElementById("begin"),
             "when"    : document.getElementById("when"),
             "worth"   : document.getElementById("worth"),
             "rate"    : document.getElementById("rate"),
             "calcBtn" : document.getElementById("calcBtn"),
             "help1"   : document.getElementById("help1"),
             "help2"   : document.getElementById("help2"),
             "help3"   : document.getElementById("help3"),
             "help4"   : document.getElementById("help4"),
            };

  ids.rate.disabled = true; 

  ids.calcBtn.disabled = true; 
  ids.calcBtn.style.color = COLORS.lightgray;
  ids.calcBtn.style.backgroundColor = COLORS.darkgray;

  ids.browse.onchange = function(event)
    {
    let csvFile = event.target.files[0];

    let filename = csvFile.name;
    let ext = filename.split('.').pop();
    if (ext != 'csv')
      {
      alert("ERROR: selected file must have a 'csv' extension");
      return;
      }

    let reader = new FileReader();
 
    reader.onload = function()
      {
      let rows = [];
      let dates = [];

      let text = reader.result;
      console.log(text);
      rows = text.split(newline);
      for (let i=0; i < rows.length; i++)
        {
        let index = rows[i].search(/^\d{8},[+-\d\.]+$/);
        if (index == 0)
          {
          let arr = rows[i].split(',');
          let date = checkDate(arr[0]);
          let val = checkVal(arr[1]); 
          if (date === false)
            {
            alert(arr[0] + " is not a valid date");
            return;
            }
          else if (val === false)
            {
            alert(arr[1] + " is not a valid amount");
            return;
            }
          else
            {
            let json = {'date':date, 'flow':val};
            trans.push(json);
            dates.push(date);
            }
          }
        }

      if (trans.length == 0)
        {
        alert("ERROR: " + csvFile.name + " contains NO valid transactions");
        return;
        }

      ids.begin.value = Math.min(...dates);
 
      ids.calcBtn.disabled = false; 
      ids.calcBtn.style.color = COLORS.gold;
      ids.calcBtn.style.backgroundColor = COLORS.navyblue;

      alert("Enter a date occurring after the date of the oldest" +
             newline + "transaction, and the account value on that" +
             newline + "date, and then click the 'COMPUTE' button.");
      };

    reader.readAsText(csvFile);
    };

  ids.calcBtn.onclick = function() 
    {
    calcClick(trans, ids);
    };

  ids.help1.onclick = function()
    {
    alert(POPUP.help1);
    };

  ids.help2.onclick = function()
    {
    alert(POPUP.help2);
    };

  ids.help3.onclick = function()
    {
    alert(POPUP.help3);
    };

  ids.help4.onclick = function()
    {
    alert(POPUP.help4);
    };
  }
   
/*    - - - - - - - - - - - - - - - - - - - - - - - - - -    */

function calcClick(trans, ids)
  {
  if (ids.when.value == "")
    {
    alert("Please enter an end date for the time interval");
    return(0);
    }

  let whenDate = checkDate(ids.when.value);
  if (whenDate === false)
    {
    return(0);
    }

  let beginDate = ids.begin.value;
  if (parseInt(whenDate,10) < parseInt(beginDate,10))
    {
    alert("'when' date cannot precede 'begin' date");
    return(0);
    }

  let whensec = (new Date(convert(whenDate))).getTime();

  for (let i=0; i<trans.length; i++)
    {
    let datesec = (new Date(convert(trans[i].date))).getTime();
    let diffsec = whensec - datesec;
    trans[i].diffyrs = diffsec/(60*60*24*365.25*1000);
    }

  if (ids.worth.value == "")
    {
    alert("Please enter the account value on " + whenDate);
    return(0);
    }
  let test = checkVal(ids.worth.value);
  if (test === false)
    {
    return(0);
    }

  let worthVal = parseFloat(test);

  let evalu8 = outer(trans);   // evalu8() is returned by the outer() closure;
                               // evalu8(), itself, returns a json

/*
*     Newton-Raphson Root Approximation Method 
*/
  let now = TOL*10, old = 0.0, counter = 0;
  while (Math.abs(now - old) > TOL)
    {
    old = now;
    let fobj = evalu8(old);
    let f = fobj.f - worthVal;
    let df = fobj.df;
    now = old - (f/df);
    counter++;
    console.log(counter + ".  old = " + old + "  now = " + now + newline);
    if (counter >= MAXITER)
      {
      alert("ERROR: Newton-Raphson method has not converged after " +
            MAXITER + " iterations");
      return;
      }
    }

  ids.rate.style.color = (now < 0) ? COLORS.red : COLORS.forestgreen;
  ids.rate.value = (now*100).toFixed(2) + '%';
  }
   
/*    - - - - - - - - - - - - - - - - - - - - - - - - - -    */

function outer(trans)           // a closure-type function
  {
  function inner(old)
    {
    let f = 0, df = 0;
    for (let i=0; i<trans.length; i++)
      {
      let flow = trans[i].flow;
      let diffyrs = trans[i].diffyrs;
      let tmp = flow * Math.exp(old*diffyrs);
      f += tmp;
      df += diffyrs * tmp;
      }
    return({"f":f, "df":df});
    }
  return(inner);
  }
   
/*    - - - - - - - - - - - - - - - - - - - - - - - - - -    */

function convert(date)
  {
  return(date.substring(0,4) + "-" + date.substring(4,6) +
         "-" + date.substring(6,8));
  }

/*    - - - - - - - - - - - - - - - - - - - - - - - - - -    */

function checkDate(str)
  {
  let date = str.trim();
  let index = date.search(/^\d{8}$/);
  if (index == -1)
    {
    alert("ERROR: date  = " + date + " must have 'yyyymmdd' format");
    return(false);
    }

  let month = parseInt(date.substring(4,6), 10);
  let day = parseInt(date.substring(6,8), 10);
  if (month < 1 || month > 12)
    {
    alert("ERROR: month " + month + " must be between 1 and 12, inclusive");
    return(false);
    }
  else if (day < 1 || day > 32)
    {
    alert("ERROR: day " + day + " must be between 01 and 31, inclusive");
    return(false);
    }
  else
    {
    return(date);
    }
  }

/*    - - - - - - - - - - - - - - - - - - - - - - - - - -    */

function checkVal(str)
  {
  let val = str.trim();
  let index = val.search(/^[+-]?[\d\.]+$/);
  if (index == -1)
    {
    alert("ERROR: the format of val  = " + val + " is invalid.");
    return(false);
    }
  else
    {
    return(val);
    }
  }
