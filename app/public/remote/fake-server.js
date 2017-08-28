;'use strict';

var fakeServer={};

fakeServer.request=function(serverRequest,callback){
    setTimeout(function() {
        var matched = fakeserverData.find(x=>{
            return x&&x.url==serverRequest.url &&
            (!x.form || JSON.stringify(x.form)==JSON.stringify(serverRequest.form))
        });
        callback&&callback(matched&&matched.content, Parser.getDateTime());
    }, 500);
}

var fakeserverData=[
    {
        url:"https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findPatient",
        form:{wd:"NICU"},
        content:'<html>\
    <head>\
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">\
    <title>電子病歷查詢功能</title>\
    <style type="text/css">\
    <!--\
        body { background:#eee;font: 14px verdana, arial, helvetica, sans-serif;}	\
        table{ font: 14px verdana, arial, helvetica, sans-serif;background: white;width:100%;border-bottom: 1px solid #999;border-right: 1px solid #999;font-size: 0.9em;}\
        th,td {border-left: 1px solid #999;border-top: 1px solid #999;padding: 0 5px;text-align: center;height: 1em;}\
        th {background: #79bcff;height: 1em;}\
        .left{text-align: left}    \
    -->\
    </style>\
    </head>\
    <body>\
    <font color="red">(@:表示病危;I:表示隔離;滑鼠移至床位可顯示DRG相關資訊)</font>\
    <table cellspacing="0" cellpadding="0" border="0" style="text-align:center;width:100%" id="bedlist">\
    \
        <thead>\
            <tr>	\
                <th>-</th>		    				\
                <th>床號</th>		    	\
                <th>姓名</th>\
                <th>病歷號</th>		    	\
                <th>性別</th>\
                <th>科別</th>	\
                <th>DRG</th>	    					\
                <th>入院日</th>\
                            \
            </tr>\
        </thead>\
        <tbody>\
    \
    <tr><td style="width:20px"><a href="qemr.cfm?action=findEmr&histno=43977748&ward=NICU-1" id="43977748" class="clickmenu01">查</a></td><td id="tips"><a class="tooltip" href="#">NICU-  1<span>1.DRG群組代碼:N19  <BR>2.DRG落點:A<BR>3.住院天數差額 :<font color="red">+16  </font><BR>4.健保給付差額:<font color="green">+0</font></span></a></td><td> <font color="red">@</font><font color="green"></font>廖oo <a href="#"  onclick="javascript:window.open("qemr.cfm?action=findIsol&histno=43977748&caseno=22477040","isol", "height=40,width=60,left=400,top=200,resizable=yes,menubar=no,scrollbars=yes,toolbar=no,status=no,titlebar=yes,location=no", true).focus()"><font color="green"></font></a></td><td>43977748  </td><td>女</td><td>NBD &nbsp;</td><td id="tips"><a class="tooltip" href="#">A<span>1.DRG群組代碼:N19  <BR>2.DRG落點:A<BR>3.住院天數差額 :<font color="red">+16  </font><BR>4.健保給付差額:<font color="green">+0</font></span></a>&nbsp;</td><td>20170808&nbsp;</td></tr>\
    \
    <tr><td style="width:20px">&nbsp;</td><td>NICU-  2</td><td colspan="6">空床</td></tr>\
    \
    <tr><td style="width:20px">&nbsp;</td><td>NICU-  3</td><td colspan="6">空床</td></tr>\
    \
    <tr><td style="width:20px"><a href="qemr.cfm?action=findEmr&histno=44052031&ward=NICU-5" id="44052031" class="clickmenu01">查</a></td><td id="tips"><a class="tooltip" href="#">NICU-  5<span>1.DRG群組代碼:N10  <BR>2.DRG落點:A<BR>3.住院天數差額 :<font color="">     </font><BR>4.健保給付差額:<font color="green">+0</font></span></a></td><td> <font color="red">@</font><font color="green"></font>謝oo之女 <a href="#"  onclick="javascript:window.open("qemr.cfm?action=findIsol&histno=44052031&caseno=22502289","isol", "height=40,width=60,left=400,top=200,resizable=yes,menubar=no,scrollbars=yes,toolbar=no,status=no,titlebar=yes,location=no", true).focus()"><font color="green"></font></a></td><td>44052031  </td><td>女</td><td>NBD &nbsp;</td><td id="tips"><a class="tooltip" href="#">A<span>1.DRG群組代碼:N10  <BR>2.DRG落點:A<BR>3.住院天數差額 :<font color="">     </font><BR>4.健保給付差額:<font color="green">+0</font></span></a>&nbsp;</td><td>20170815&nbsp;</td></tr>\
    \
    <tr><td style="width:20px"><a href="qemr.cfm?action=findEmr&histno=44051210&ward=NICU-6" id="44051210" class="clickmenu01">查</a></td><td id="tips"><a class="tooltip" href="#">NICU-  6<span>1.DRG群組代碼:24101<BR>2.DRG落點:A<BR>3.住院天數差額 :<font color="red">+0   </font><BR>4.健保給付差額:<font color="green">+0</font></span></a></td><td> <font color="red">@</font><font color="green"></font>阮oo之女 <a href="#"  onclick="javascript:window.open("qemr.cfm?action=findIsol&histno=44051210&caseno=22533918","isol", "height=40,width=60,left=400,top=200,resizable=yes,menubar=no,scrollbars=yes,toolbar=no,status=no,titlebar=yes,location=no", true).focus()"><font color="green"></font></a></td><td>44051210  </td><td>女</td><td>NBD &nbsp;</td><td id="tips"><a class="tooltip" href="#">A<span>1.DRG群組代碼:24101<BR>2.DRG落點:A<BR>3.住院天數差額 :<font color="red">+0   </font><BR>4.健保給付差額:<font color="green">+0</font></span></a>&nbsp;</td><td>20170825&nbsp;</td></tr>\
    \
    <tr><td style="width:20px"><a href="qemr.cfm?action=findEmr&histno=44051798&ward=NICU-7" id="44051798" class="clickmenu01">查</a></td><td id="tips"><a class="tooltip" href="#">NICU-  7<span>1.DRG群組代碼:N17  <BR>2.DRG落點:D<BR>3.住院天數差額 :<font color="red">+18  </font><BR>4.健保給付差額:<font color="green">+0</font></span></a></td><td> <font color="red">@</font><font color="green"></font>陳oo <a href="#"  onclick="javascript:window.open("qemr.cfm?action=findIsol&histno=44051798&caseno=22458119","isol", "height=40,width=60,left=400,top=200,resizable=yes,menubar=no,scrollbars=yes,toolbar=no,status=no,titlebar=yes,location=no", true).focus()"><font color="green"></font></a></td><td>44051798  </td><td>男</td><td>NBD &nbsp;</td><td id="tips"><a class="tooltip" href="#">D<span>1.DRG群組代碼:N17  <BR>2.DRG落點:D<BR>3.住院天數差額 :<font color="red">+18  </font><BR>4.健保給付差額:<font color="green">+0</font></span></a>&nbsp;</td><td>20170803&nbsp;</td></tr>\
    \
    <tr><td style="width:20px">&nbsp;</td><td>NICU-  8</td><td colspan="6">空床</td></tr>\
    \
    <tr><td style="width:20px">&nbsp;</td><td>NICU-  9</td><td colspan="6">空床</td></tr>\
    \
    <tr><td style="width:20px">&nbsp;</td><td>NICU- 10</td><td colspan="6">空床</td></tr>\
    \
    <tr><td style="width:20px"><a href="qemr.cfm?action=findEmr&histno=44124789&ward=NICU-11" id="44124789" class="clickmenu01">查</a></td><td id="tips"><a class="tooltip" href="#">NICU- 11<span>1.DRG群組代碼:41702<BR>2.DRG落點:D<BR>3.住院天數差額 :<font color="red">+11  </font><BR>4.健保給付差額:<font color="green">+0</font></span></a></td><td> <font color="red">@</font><font color="green"></font>曾oo之女 <a href="#"  onclick="javascript:window.open("qemr.cfm?action=findIsol&histno=44124789&caseno=22484582","isol", "height=40,width=60,left=400,top=200,resizable=yes,menubar=no,scrollbars=yes,toolbar=no,status=no,titlebar=yes,location=no", true).focus()"><font color="green"></font></a></td><td>44124789  </td><td>女</td><td>NBD &nbsp;</td><td id="tips"><a class="tooltip" href="#">D<span>1.DRG群組代碼:41702<BR>2.DRG落點:D<BR>3.住院天數差額 :<font color="red">+11  </font><BR>4.健保給付差額:<font color="green">+0</font></span></a>&nbsp;</td><td>20170810&nbsp;</td></tr>\
    \
    <tr><td style="width:20px">&nbsp;</td><td>NICU- 12</td><td colspan="6">空床</td></tr>\
    \
    <tr><td style="width:20px">&nbsp;</td><td>NICU- 14</td><td colspan="6">空床</td></tr>\
      \
    </tbody>  \
    </table>\
    </body>\
    </html>'
    },
    {
        url:"https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findEmr&histno=43977748",
        content:"preselected"
    },
    {
        url:"https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findNicu&histno=43977748",
        content:"admission list"
    }
];

server.request=fakeServer.request;