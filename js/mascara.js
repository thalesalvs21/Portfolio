function telefone(){

let tel_formatado = document.getElementById("tel").value
if (tel_formatado[0]!="(")
{
    if(tel_formatado[0]!=undefined)
    {
        document.getElementById("tel").value="("+tel_formatado[0];
    }
}

if (tel_formatado[3]!=")")
{
    if(tel_formatado[3]!=undefined)
    {
        document.getElementById("tel").value=tel_formatado.slice(0,3)+")"+tel_formatado[3]
    }
}

if (tel_formatado[9]!="-")
{
    if(tel_formatado[9]!=undefined)
    {
        document.getElementById("tel").value=tel_formatado.slice(0,9)+"-"+tel_formatado[9]
    }
}
}