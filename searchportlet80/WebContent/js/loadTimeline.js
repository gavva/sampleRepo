//*********************** ES COPYRIGHT START  *********************************
// @copyright(disclaimer)
// 
// Licensed Materials - Property of IBM
// 5724-Z21
// (C) Copyright IBM Corp. 2003, 2012
// 
// US Government Users Restricted Rights
// Use, duplication or disclosure restricted by GSA ADP Schedule
// Contract with IBM Corp.
// 
// DISCLAIMER OF WARRANTIES :
// 
// Permission is granted to copy and modify this Sample code, and to
// distribute modified versions provided that both the copyright
// notice, and this permission notice and warranty disclaimer appear
// in all copies and modified versions.
// 
// THIS SAMPLE CODE IS LICENSED TO YOU "AS-IS".
// IBM  AND ITS SUPPLIERS AND LICENSORS  DISCLAIM
// ALL WARRANTIES, EITHER EXPRESS OR IMPLIED, IN SUCH SAMPLE CODE,
// INCLUDING THE WARRANTY OF NON-INFRINGEMENT AND THE IMPLIED WARRANTIES
// OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. IN NO EVENT
// WILL IBM OR ITS LICENSORS OR SUPPLIERS BE LIABLE FOR ANY DAMAGES ARISING
// OUT OF THE USE OF  OR INABILITY TO USE THE SAMPLE CODE, DISTRIBUTION OF
// THE SAMPLE CODE, OR COMBINATION OF THE SAMPLE CODE WITH ANY OTHER CODE.
// IN NO EVENT SHALL IBM OR ITS LICENSORS AND SUPPLIERS BE LIABLE FOR ANY
// LOST REVENUE, LOST PROFITS OR DATA, OR FOR DIRECT, INDIRECT, SPECIAL,
// CONSEQUENTIAL,INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER CAUSED AND REGARDLESS
// OF THE THEORY OF LIABILITY, EVEN IF IBM OR ITS LICENSORS OR SUPPLIERS
// HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
// 
// @endCopyright
//*********************** ES COPYRIGHT END  ***********************************
   
// This script creates the flash player object in IE.  This allows
// the player to be created as an activated control, to get rid of
// the 'click to activate' message in IE

document.write('<div id="flashPlayer" style="padding: 0; margin: 0px; overflow:hidden; height: 100%; width: 100%;">');
document.write('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="timelineObject" style="height:100%;width:100%;" width="100%" height="100%" codebase="https://download.macromedia.com/get/flashplayer/current/swflash.cab">');
document.write('<param name="src" value="flex/timeline.swf" />');
document.write('<param name="quality" value="high" />');
document.write('<param name="bgcolor" value="#869ca7" />');
document.write('<param name="wmode" value="transparent" />');
document.write('<param name="loop" value="false" />');
document.write('<embed name="timelineObject" src="flex/timeline.swf?' + EDR.BuildNumber + '" quality="high" bgcolor="#869ca7" width="100%" height="100%" loop="false" wmode="transparent" pluginspage="https://www.adobe.com/go/getflashplayer"></embed>');
document.write('</object>');
document.write('</div>');