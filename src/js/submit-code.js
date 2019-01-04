import {parseCode} from './code-analyzer';
import {createArray} from './table-creator';


let arr=[];
let valuesTable=[];

function getCode(codeToParse,args){
    let parsedCode = parseCode(codeToParse);
    let array=createArray(parsedCode);
    let valuesTable=getUpdetedValuesTable(array);
    let submittedCode=codeSubmittion(codeToParse,valuesTable);
    let argumentTable=getArgumentTable(array,args);
    let finalCode=insertArgs(submittedCode,argumentTable,valuesTable);
    return arrangeCode(finalCode,array);

}

function getCode2(codeToParse,args){
    let parsedCode = parseCode(codeToParse);
    let array=createArray(parsedCode);//יוצר מערך לטבלה
    valuesTable=getUpdetedValuesTable(array);//יוצר מערך לטבלה עם החלפה של משתנים   
    let submittedCode=codeSubmittion(codeToParse,valuesTable);//מחליף לארגומנטים
    let argumentTable=getArgumentTable(array,args);//מחזיר ארגומנטים
    insertArgs2(submittedCode,argumentTable,valuesTable);
    return valuesTable;
    
}

function getUpdetedValuesTablveVars(vars,i,arr){
    if(arr[i].Type==='Variable Declaration'||arr[i].Type==='Assignment Expression'){
        vars=varDec(vars,i);}
    return vars;
}

function getUpdetedValuesTablIf(vars,i,arr){
    if(arr[i].Type==='If Statement'||arr[i].Type==='Else If Statement'){
        ifSt(vars,i);
        let end=arr[i].End;
        i++;
        for (var j = i; j < arr.length; j++){
            if(arr[j].Line<end)
                i++;
            else{ 
                i--;
                break;}
        }
    }
    return i;

}

function getUpdetedValuesTableiff(c,i,vars,arr){
    if(arr[c].Type==='While Statement'){
        ifSt(vars,c);
        let end=arr[c].End;
        c++;
        for (var k = c; k < arr.length; k++){
            if(arr[k].Line<end)
                c++;
            else{
                c--;
                break;}
            i=c;
        }
    }
    else if(arr[c].Type==='Return Statment'){
        retSt(vars,c);
        i=c;}
    return i;
}

function getUpdetedValuesTable(array){
    arr=array;
    let vars=[];
    for (var i = 0; i < arr.length; i++) {
        vars=getUpdetedValuesTablveVars(vars,i,arr);
        let c=i;
        i=getUpdetedValuesTablIf(vars,i,arr);
        i=getUpdetedValuesTableiff(c,i,vars,arr);}
    return arr;}

function verDec1forif(i,valueVariables,valueInIndex,j,index,flag){
    if((arr[i].Value)[j]!='+'&&(arr[i].Value)[j]!='-'&&(arr[i].Value)[j]!='*'&&(arr[i].Value)[j]!='/')
    {
        flag=false;
        valueInIndex=valueInIndex+(arr[i].Value)[j];
        valueVariables[index]=valueInIndex;
    }
    return {'valuein':valueInIndex,'valueVar':valueVariables,'flag':flag};

}
function verDec1for(i,valueVariables){
    let valueInIndex='';
    let index=0;
    for(var j = 0; j < (arr[i].Value).length; j++)
    {
        let elseEntry=true;
        if((arr[i].Value)[j]!=')'&&(arr[i].Value)[j]!='(')
        {
            let js=verDec1forif(i,valueVariables,valueInIndex,j,index,elseEntry);
            valueInIndex=js.valuein;
            valueVariables=js.valueVar;
            elseEntry=js.flag;
        }
        if(elseEntry){
            index++;
            valueInIndex='';
            valueVariables[index]=(arr[i].Value)[j];
            index++;
        }
    }return valueVariables;}
    
    
    
    
    

function verDec2If(valueVariables,k,j,vars){
    if(vars[j].key===valueVariables[k])
    {
        valueVariables[k]=(vars[j].value);
    }
    return valueVariables[k];
}


function verDec2for(vars,i,valueVariables){
    for(var j = 0; j < vars.length; j++)
    {
        for(var k = 0; k < valueVariables.length; k++)
        {
            valueVariables[k]=verDec2If(valueVariables,k,j,vars);
        }
    }
    let val='';
    for(var p = 0; p < valueVariables.length; p++){
        if(valueVariables[p]!=undefined)
            val=val+valueVariables[p];
    }
    return '('+val+')';
}


function varDec(vars,i){
    let valueVariables=[''];
    valueVariables=verDec1for(i,valueVariables);
    let val=verDec2for(vars,i,valueVariables);
    let flag=false;
    for(var j=0; j<vars.length; j++)
    {
        if(vars[j].key===arr[i].Name)
        {
            vars[j].value=val;
            flag=true;
        }  
    }
    if(flag===false){
        vars.push({'key':arr[i].Name, 'value':val});
    }
    arr[i].Value=val;
    return vars;
}

function ifFor1if(i,valueVariables,valueInIndex,j,index,flag){
    if((arr[i].Condition)[j]!='+'&&(arr[i].Condition)[j]!='-'&&(arr[i].Condition)[j]!='*'&&(arr[i].Condition)[j]!='/')
    {
        let js=ifFor1if2(i,valueVariables,valueInIndex,j,index,flag);
        valueInIndex=js.valuein;
        valueVariables=js.valueVar;
        flag=js.flag;
    }
    return {'valuein':valueInIndex,'valueVar':valueVariables,'flag':flag};

}



function ifFor1if2(i,valueVariables,valueInIndex,j,index,flag){
    if((arr[i].Condition)[j]!=')'&&(arr[i].Condition)[j]!='('&&(arr[i].Condition)[j]!='='&&(arr[i].Condition)[j]!='!=')
    {
        let js=ifFor1if3(i,valueVariables,valueInIndex,j,index,flag);
        valueInIndex=js.valuein;
        valueVariables=js.valueVar;
        flag=js.flag;
    }
    return {'valuein':valueInIndex,'valueVar':valueVariables,'flag':flag};
}

function ifFor1if3(i,valueVariables,valueInIndex,j,index,flag){
    if((arr[i].Condition)[j]!='<')
    {
        let js=ifFor1if4(i,valueVariables,valueInIndex,j,index,flag);
        valueInIndex=js.valuein;
        valueVariables=js.valueVar;
        flag=js.flag;
    }
    return {'valuein':valueInIndex,'valueVar':valueVariables,'flag':flag};
}



function ifFor1if4(i,valueVariables,valueInIndex,j,index,flag){
    if((arr[i].Condition)[j]!='&'&&(arr[i].Condition)[j]!='|'&&(arr[i].Condition)[j]!='!'&&(arr[i].Condition)[j]!=']')
    {
        flag=false;
        valueInIndex=valueInIndex+(arr[i].Condition)[j];
        valueVariables[index]=valueInIndex;
    }
    return {'valuein':valueInIndex,'valueVar':valueVariables,'flag':flag};
}

function ifFor1(i){
    let valueVariables=[''];
    let index=0;
    let valueInIndex='';
    for(var j = 0; j < (arr[i].Condition).length; j++){
        let elseEntry=true;
        if((arr[i].Condition)[j]!='['&&(arr[i].Condition)[j]!='>')
        {
            let js=ifFor1if(i,valueVariables,valueInIndex,j,index,elseEntry);
            valueInIndex=js.valuein;
            valueVariables=js.valueVar;
            elseEntry=js.flag;
        
        }if(elseEntry){
            index++;
            valueInIndex='';
            valueVariables[index]=(arr[i].Condition)[j];
            index++;
        }   
    }return valueVariables;}






function ifSt(vars,i){
    let ifVars=JSON.parse(JSON.stringify(vars));
    let valueVariables=ifFor1(i);
    for(var t = 0; t < ifVars.length; t++){
        for(var k = 0; k < valueVariables.length; k++)
        {
            valueVariables[k]=verDec2If(valueVariables,k,t,ifVars);
        }
    }
    let val='';
    for(var p = 0; p < valueVariables.length; p++){
        if(valueVariables[p]!=undefined)
            val=val+valueVariables[p];
    }
    arr[i].Condition='('+val+')';
    getUpdetedValuesTableIf(ifVars,i,arr[i].End);
}

function getUpdetedValuesTableIf2if(ifVars,arr,i){
    if(arr[i].Type==='Variable Declaration'||arr[i].Type==='Assignment Expression')
    {
        ifVars=varDec(ifVars,i);
    }
    return ifVars;
}
function getUpdetedValuesTableIf2(ifVars,i){
    ifVars=getUpdetedValuesTableIf2if(ifVars,arr,i);
    if(arr[i].Type==='If Statement'||arr[i].Type==='Else If Statement')
    {
        ifSt(ifVars,i);
        let end=arr[i].End;
        for (var j = i; j < arr.length; j++){
            if(arr[j].Line<end)
                i++;
            else {
                i--;
                break;
            }
        }
    }
    return ifVars;
}



function getUpdetedValuesTableIfinsideFor(ifVars,i){
    if(arr[i].Type==='While Statement'){
        ifSt(ifVars,i);
        let end=arr[i].End;
        i++;
        for (var p = i; p < arr.length; p++){
            if(arr[p].Line<end)
                i++;
            else {
                i--;
                break;
            }
        }
    }
    return i;
}


function getUpdetedValuesTableIf(ifVars,k,end){
    for (var i = k+1; (i < arr.length)&&(arr[i].Line<end); i++) {
        ifVars=getUpdetedValuesTableIf2(ifVars,i);
        let c=i;
        i=getUpdetedValuesTableIfinsideFor(ifVars,i);
        if(arr[c].Type==='Return Statment')
            retSt(ifVars,c);
    }
}

function retStFor(i){
    let valueVariables=[''];
    let index=0;
    let valueInIndex='';
    for(var j = 0; j < (arr[i].Value).length; j++)
    {
        let elseEntry=true;
        if((arr[i].Value)[j]!='+'&&(arr[i].Value)[j]!='-')
        {
            let js=retStfro2(elseEntry,j,i,valueInIndex,valueVariables,index);
            elseEntry=js.flag;
            valueInIndex=js.valuein;
            valueVariables=js.valueVar;
    
        }if(elseEntry){
            index++;
            valueInIndex='';
            valueVariables[index]=(arr[i].Value)[j];
            index++;}}
    return valueVariables;}

function retStfro2(elseEntry,j,i,valueInIndex,valueVariables,index){
    if((arr[i].Value)[j]!='*'&&(arr[i].Value)[j]!='/'&&(arr[i].Value)[j]!=')'&&(arr[i].Value)[j]!='(')
    {
        elseEntry=false;
        valueInIndex=valueInIndex+(arr[i].Value)[j];
        valueVariables[index]=valueInIndex;
    }
    return {'valuein':valueInIndex,'valueVar':valueVariables,'flag':elseEntry};

}




function retSt(vars,i){
    let valueVariables=retStFor(i);
    for(var p = 0; p < vars.length; p++)
    {
        for(var k = 0; k < valueVariables.length; k++)
        {
            valueVariables[k]=verDec2If(valueVariables,k,p,vars);
        }
    }
    let val='';
    for(var t = 0; t < valueVariables.length; t++){
        if(valueVariables[t]!=undefined)
            val=val+valueVariables[t];
    }
    val='('+val+')';
    arr[i].Value=val;
}



function getArgFor(argsInput){
    let arg='';
    let argsValue=[];
    for (var i = 0; i < argsInput.length; i++) {
        let elseEntry=true;
        let js=getArgforIf(i,argsInput,arg,elseEntry);
        elseEntry=js.elseEntry;
        i=js.i;
        arg=js.arg;
        if(elseEntry){while(i< argsInput.length&&argsInput[i]!=',')
        {
            arg=arg+argsInput[i];
            i++;
        }
        }
        argsValue.push(arg);
        arg=''; }
    return argsValue;
}

function getArgforIf(i,argsInput,arg,elseEntry){
    if(argsInput[i]==='['){
        while(i<argsInput.length&&argsInput[i]!=']'){
            arg=arg+argsInput[i];
            i++;}
        arg=arg+']';
        i++;
    }
    return {'elseEntry':elseEntry,'arg':arg,'i':i};


}

function getArgumentTable(arr,argsInput){
    let args=[];
    let argsTable=[];
    let argsValue=getArgFor(argsInput);
    for (var k = 0; k < arr.length; k++) {
        if(arr[k].Type==='Argument Declaration')
            args.push(arr[k].Name);
    }
    for(var t = 0; t < args.length; t++)
    {
        argsTable.push({'name':args[t],'value':argsValue[t]});
    }
    return argsTable;
}

function insertArgsFor1(array,i){
    let index=0;
    let valueVariables=[''];
    let valueInIndex='';
    for(var j = 0; j < (array[i].Condition).length; j++){
        let elseEntry=true;
        if((arr[i].Condition)[j]!='[')
        {
            let js=insertArgsFor1if1(valueInIndex,valueVariables,i,index,array,elseEntry,j);
            valueInIndex=js.valuein;
            valueVariables=js.valueVar;
            elseEntry=js.elseEntry;}
        if(elseEntry) {
            index++;
            valueInIndex='';
            valueVariables[index]=(array[i].Condition)[j];
            index++;
        }}
    return valueVariables;
}


function insertArgsFor1if1(valueInIndex,valueVariables,i,index,array,elseEntry,j){
    if((array[i].Condition)[j]!='+'&&(array[i].Condition)[j]!='-'&&(array[i].Condition)[j]!='*'&&(array[i].Condition)[j]!='/'){
        let js=insertArgsFor1if2(valueInIndex,valueVariables,i,index,array,elseEntry,j);
        valueInIndex=js.valuein;
        valueVariables=js.valueVar;
        elseEntry=js.elseEntry;
    }
    return {'valuein':valueInIndex,'valueVar':valueVariables,'elseEntry':elseEntry};
}

function insertArgsFor1if2(valueInIndex,valueVariables,i,index,array,elseEntry,j){
    if((array[i].Condition)[j]!=')'&&(array[i].Condition)[j]!='('&&(array[i].Condition)[j]!='='&&(array[i].Condition)[j]!='<'){
        let js=insertArgsFor1if3(valueInIndex,valueVariables,i,index,array,elseEntry,j);
        valueInIndex=js.valuein;
        valueVariables=js.valueVar;
        elseEntry=js.elseEntry;
    }
    return {'valuein':valueInIndex,'valueVar':valueVariables,'elseEntry':elseEntry};
}

function insertArgsFor1if3(valueInIndex,valueVariables,i,index,array,elseEntry,j){
    if((array[i].Condition)[j]!='>'&&(array[i].Condition)[j]!=')'&&(array[i].Condition)[j]!='('&&(arr[i].Condition)[j]!='&'){
        let js=insertArgsFor1if4(valueInIndex,valueVariables,i,index,array,elseEntry,j);
        valueInIndex=js.valuein;
        valueVariables=js.valueVar;
        elseEntry=js.elseEntry;
    }
    return {'valuein':valueInIndex,'valueVar':valueVariables,'elseEntry':elseEntry};
}

function insertArgsFor1if4(valueInIndex,valueVariables,i,index,array,elseEntry,j){
    if((arr[i].Condition)[j]!='|'&&(arr[i].Condition)[j]!='!'&&(arr[i].Condition)[j]!=']'){
        elseEntry=false;
        valueInIndex=valueInIndex+(array[i].Condition)[j];
        valueVariables[index]=valueInIndex;
    }
    return {'valuein':valueInIndex,'valueVar':valueVariables,'elseEntry':elseEntry};
}



function insertArgsFor2(argumentTable,valueVariables){
    for(var p = 0; p <argumentTable.length; p++)
    {
        for(var k = 0; k < valueVariables.length; k++)
        {
            if(argumentTable[p].name===valueVariables[k])
            {
                valueVariables[k]=(argumentTable[p].value);
            }
        }
    }
    return valueVariables;

}

function insertArgsCond(valueVariables,lines,i,array){
    let cond='';
    for(var t = 0; t < valueVariables.length; t++){
        if(valueVariables[t]!=undefined)
            cond=cond+valueVariables[t];}
    if(eval(cond)===true)
    {
        lines[array[i].Line-1]= '<mark style="background-color:green;">'+lines[array[i].Line-1].replace('<','< ')+'</mark>';
    }
       
    else
    {
        lines[array[i].Line-1]= '<mark style="background-color:red;">'+lines[array[i].Line-1].replace('<','< ')+'</mark>';
    }

    return lines;

}

function insertArgs(submittedCode,argumentTable,array){
    let lines=submittedCode.split(/\r?\n/);
    for (var i = 0; i < array.length; i++) {
        if(array[i].Type==='If Statement'||array[i].Type==='Else If Statement')
        {
            let valueVariables=insertArgsFor1(array,i);
            valueVariables=insertArgsFor2(argumentTable,valueVariables);
            lines=insertArgsCond(valueVariables,lines,i,array);
        } }
    let newCode='';
    for (var b = 0; b < lines.length; b++){
        newCode=newCode+'<br/>'+'\n'+lines[b];}
    return newCode;}

function insertArgsCond2(valueVariables,lines,i,array){
    let cond='';

    for(var t = 0; t < valueVariables.length; t++){
        if(valueVariables[t]!=undefined)
            cond=cond+valueVariables[t];}
    if(eval(cond)===true)
    {
        lines[array[i].Line-1]= '<mark style="background-color:green;">'+lines[array[i].Line-1].replace('<','< ')+'</mark>';
        valuesTable[i]['Condition']='true';
    } 
    else
    {
        lines[array[i].Line-1]= '<mark style="background-color:red;">'+lines[array[i].Line-1].replace('<','< ')+'</mark>';
        valuesTable[i]['Condition']='false';
    }
    return lines;
}

function insertArgs2(submittedCode,argumentTable,array){
    let lines=submittedCode.split(/\r?\n/);
    for (var i = 0; i < array.length; i++) {
        if(array[i].Type.includes('If Statement')||array[i].Type==='While Statement')
        {
            let valueVariables=insertArgsFor1(array,i);
            valueVariables=insertArgsFor2(argumentTable,valueVariables);
            lines=insertArgsCond2(valueVariables,lines,i,array);
        } }
    let newCode='';
    for (var b = 0; b < lines.length; b++){
        newCode=newCode+'<br/>'+'\n'+lines[b];}
    return newCode;}

function codeSubmittion2(lines,arr,i){
    if(arr[i].Type==='Else If Statement'){
        lines=ifInsidecodeSubmittion2(lines,arr,i);
    }
    lines=codeSubmittion3(lines,arr,i);
    return lines;
}

function ifInsidecodeSubmittion2(lines,arr,i){
    if( lines[arr[i].Line-1].includes('{')&&lines[arr[i].Line-1].includes('}'))
        lines[arr[i].Line-1]='}else if('+arr[i].Condition+'){';
    else if( lines[arr[i].Line-1].includes('}'))
        lines[arr[i].Line-1]='}else if('+arr[i].Condition+')';
    else if( lines[arr[i].Line-1].includes('{'))
        lines[arr[i].Line-1]='else if('+arr[i].Condition+'){';
    else
        lines[arr[i].Line-1]='else if('+arr[i].Condition+')';
    return lines;
}

function codeSubmittion3(lines,arr,i){
    if(arr[i].Type==='Else Statment'){
        ifInsidecodeSubmittion3(lines,arr,i);
    }
    return lines;
}

function ifInsidecodeSubmittion3(lines,arr,i){
    if( lines[arr[i].Line-1].includes('{')&&lines[arr[i].Line-1].includes('}'))
        lines[arr[i].Line-1]='}else{';
    else if( lines[arr[i].Line-1].includes('{'))
        lines[arr[i].Line-1]='else{';
    else if( lines[arr[i].Line-1].includes('}'))
        lines[arr[i].Line-1]='}else';
    else
        lines[arr[i].Line-1]='else';
    return lines;
    
}

function codeSubmittion1(lines,arr,i){
    if(arr[i].Type==='Variable Declaration')
        lines[arr[i].Line-1]='let '+arr[i].Name+'='+arr[i].Value+';';
    if(arr[i].Type==='Assignment Expression')
        lines[arr[i].Line-1]=arr[i].Name+'='+arr[i].Value+';';
    if(arr[i].Type==='If Statement')
    {
        if( lines[arr[i].Line-1].includes('{'))
            lines[arr[i].Line-1]='if('+arr[i].Condition+'){';
        else
            lines[arr[i].Line-1]='if('+arr[i].Condition+')';
    }
    return lines;
}

function ifReturn(lines,i){
    if(arr[i].Type==='Return Statment')
        lines[arr[i].Line-1]='return '+arr[i].Value+';';
    return lines[arr[i].Line-1];

}


function codeSubmittion(codeToParse,arr){
    let submittedCode='';
    let lines=codeToParse.split(/\r?\n/);
    for(var i=0; i<arr.length; i++){
        lines=codeSubmittion1(lines,arr,i);
        lines=codeSubmittion2(lines,arr,i);
        if(arr[i].Type==='While Statement'){
            if( lines[arr[i].Line-1].includes('{'))
                lines[arr[i].Line-1]='while('+arr[i].Condition+'){';
            else
                lines[arr[i].Line-1]='while('+arr[i].Condition+')';}
        lines[arr[i].Line-1]=ifReturn(lines,i);
       
    }
    for(var j=0; j<lines.length; j++)
    {
        submittedCode=submittedCode+lines[j]+'\n';
    }
    return submittedCode;
}




function arrangeCodeFor(lines,args){
    let newText='';
    for (var i = 0; i < lines.length; i++) {
        lines[i]=lines[i].replace(/^\s+/g, '');
        if(lines[i].startsWith('let')||lines[i].startsWith('var'))
            continue;
        let elseEntry=true;
        if(lines[i].startsWith('while')){
            elseEntry=false;
            newText=newText+lines[i]+'\n';}
        let js=arrangeCodeFor2(i,lines,newText,elseEntry);
        newText=js.text;
        elseEntry=js.elseEntry;    
        newText= elseEntrycheck(elseEntry,args,i,newText,lines);}
    return newText;}

function elseEntrycheck(elseEntry,args,i,newText,lines){
    if(elseEntry){
        for (var j = 0; j < args.length; j++) {
            if(lines[i].startsWith(args[j])){
                newText=newText+lines[i]+'\n';
                break;
            }}}
    return newText;
}

function arrangeCodeFor2(i,lines,newText,elseEntry){
    if(lines[i].startsWith('<mark')||lines[i].startsWith('else'))
    {
        elseEntry=false;
        newText=newText+lines[i]+'\n';
    }
    let js=arrangeCodeFor3(i,lines,newText,elseEntry);
    newText=js.text;
    elseEntry=js.elseEntry;
    return {'elseEntry':elseEntry,'text':newText};
}

function arrangeCodeFor3(i,lines,newText,elseEntry){
    if(lines[i].startsWith('{')||lines[i].startsWith('}')||lines[i].startsWith('return')||lines[i].startsWith('function'))
    {
        elseEntry=false;
        newText=newText+lines[i]+'\n';
    }
    return {'elseEntry':elseEntry,'text':newText};
}


function arrangeCode(codeToParse,arr){
    let args=[];
    for (var k = 0; k < arr.length; k++) {
        if(arr[k].Type==='Argument Declaration')
        {
            args.push(arr[k].Name);
        }
    }
    let lines=codeToParse.split(/\r?\n/);
    let newText= arrangeCodeFor(lines,args);
    return newText;
}



export{getUpdetedValuesTable,arrangeCode,getArgumentTable,insertArgs,codeSubmittion,getCode, getCode2};