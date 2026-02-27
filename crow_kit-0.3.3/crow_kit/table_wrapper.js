window.userTasksCompleted = false;
window.inputFieldValues = [];
var panel_container_name = 'panel-container-auto-wrapper-x999999999990x0x0';
var popup_container = 'popup_container';
var panel_background_color = '#0d6efd';
var mouse_hover_background_color = '#ffc107';

var table_path = '';
var next_path = '';
var present_selection = '';
var selectClassNames = '';

var basePanelTemplate = `
  <div class="st-actionContainer left-bottom">
    <div class="st-panel">
      <div class="st-panel-header">
        <i class="fa fa-bars" aria-hidden="true"></i>
        Wrapper Generation Panel - <b>Table</b>
      </div>

      <div class="st-panel-contents" style="text-align:center;">

        <div id="howto_box"
             style="text-align:left; font-size:12px; line-height:1.35;
                    background:#f8f9fa; border:1px solid #ddd; border-radius:6px;
                    padding:8px; margin:8px;">
          <b>How to use</b>
         <ol style="margin:6px 0 0 18px; padding:0;">
            <li>
                Click <b>Select Table</b> (button is <span style="color:red;"><b>red</b></span>).
                Then <b>right-click</b> the target table on the page.
                When successfully selected, the button turns <span style="color:green;"><b>green</b></span>.
            </li>
            <li>Click <b>Done</b> to save.</li>
            </ol>
          <div style="margin-top:6px;">
            Tip: Right-click avoids triggering the website’s own click actions.
          </div>
        </div>

        <div id="status_hint"
             style="display:none; margin:8px; padding:6px;
                    background:#e7f1ff; border:1px solid #b6d4fe; border-radius:6px;
                    color:#084298; font-size:12px;">
        </div>

        <button style="background-color: #dc3545 !important;margin-top:5px;"
                id="st_click" class="st_click"
                title="Click, then right-click the table you want to scrape">
          Select Table
        </button>

        <br><br>

        <button style="background-color: #dc3545 !important;margin-top:5px; display:none;"
                id="snp_click" class="snp_click"
                title="Click, then right-click the Next button/link on the page">
          Select Next Page
        </button>

        <br>
      </div>

      <div class="grid" style="text-align:center;">
        <button style="cursor:pointer; width: 200px !important;background-color: #ccc !important;"
                class="doneBtn">✔ Done</button>

        <div id="success_message"
             style="display:none; margin-top:10px; padding:8px;
                    background-color:#d4edda; color:#155724;
                    border:1px solid #c3e6cb; border-radius:5px;">
        </div>
      </div>
    </div>

    <div class="st-btn-container left-bottom">
      <div class="st-button-main"><i class="fa fa-bars" aria-hidden="true"></i></div>
    </div>
  </div>
`;

var panel = document.createElement('div');
panel.style.zIndex = '999999999';
panel.id = panel_container_name;

panel.insertAdjacentHTML('beforeend', basePanelTemplate);
document.body.appendChild(panel);

$(document).ready(function () {
    // FIX: use class selector
    $('.st-actionContainer').launchBtn({ openDuration: 500, closeDuration: 300 });
});

document.addEventListener('mouseover', function (event) {
    var target = event.target;
    if (!isInjectedButton(target)) {
        target.style.backgroundColor = mouse_hover_background_color;
    }
});

document.addEventListener('mouseout', function (event) {
    var target = event.target;
    if (!isInjectedButton(target)) {
        target.style.backgroundColor = '';
    }
});

function getXPath(element) {
    var xpath = '';
    for (; element && element.nodeType === 1; element = element.parentNode) {
        var id = 1;
        for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
            if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
                id++;
            }
        }
        id > 1 ? (id = '[' + id + ']') : (id = '');
        xpath = '/' + element.tagName.toLowerCase() + id + xpath;
    }
    var text = document.evaluate('string(' + xpath + ')', document, null, XPathResult.STRING_TYPE, null).stringValue;
    return { xpath: xpath, text: text.trim() };
}

function isInjectedButton(element) {
    var menuContainer = document.getElementById(panel_container_name);
    var popup_container_data = document.getElementById(popup_container);
    var sweetAlertContainer2 = document.getElementsByClassName('swal2-container');

    if (popup_container_data) {
        if (menuContainer.contains(element) || popup_container_data.contains(element)) {
            return true;
        }
    } else {
        if (menuContainer.contains(element)) {
            return true;
        }
    }

    for (var i = 0; i < sweetAlertContainer2.length; i++) {
        if (sweetAlertContainer2[i].contains(element)) {
            return true;
        }
    }
    return false;
}

function generateRelativeClassNames(event) {
    selectClassNames = '';
    var hierarchy = [], current = event.srcElement || event.originalTarget;
    while (current.parentNode) {
        hierarchy.unshift(current);
        current = current.parentNode;
    }
    var xPathSegments = hierarchy.map(function (el) {
        return ((el.className !== '') ? '.' + el.className.split(' ').join('.') : '');
    });
    if (xPathSegments.length > 0) {
        selectClassNames = xPathSegments[xPathSegments.length - 1];
    }
    return selectClassNames;
}

document.addEventListener('contextmenu', generateRelativeClassNames);

document.addEventListener('contextmenu', function (event) {
    var target = event.target;

    if (!isInjectedButton(target)) {
        var path = getXPath(target);

        if (present_selection == 'table_path') {
            table_path = path.xpath;

            $('.st_click').css('background-color', 'green');
            $('.st_click').css('color', 'white');


            //$('#snp_click').show();

            var hint = document.getElementById('status_hint');
            if (hint) {
                hint.innerText = "Table selected!";
                hint.style.display = "block";
            }
        }
        else if (present_selection == 'next_path') {
            next_path = path.xpath;

            $('.snp_click').css('background-color', 'green');
            $('.snp_click').css('color', 'white');

            var hint2 = document.getElementById('status_hint');
            if (hint2) {
                hint2.innerText = "Next Page selected. Click Done to save.";
                hint2.style.display = "block";
            }
        }

        event.preventDefault();
        return false;
    }
});

panel.querySelector('.st_click').addEventListener('click', function () {
    present_selection = 'table_path';

    var hint = document.getElementById('status_hint');
    if (hint) {
        hint.innerText = "Now right-click the TABLE on the webpage to select it.";
        hint.style.display = "block";
    }
});

panel.querySelector('.snp_click').addEventListener('click', function () {
    present_selection = 'next_path';

    var hint = document.getElementById('status_hint');
    if (hint) {
        hint.innerText = "Now right-click the NEXT button/link on the webpage.";
        hint.style.display = "block";
    }
});

$(".st-actionContainer").on("click", ".doneBtn", function (event) {
    table_path = table_path.trim();
    if (table_path == '') {
        Swal.fire({
            icon: "info",
            text: "Please select which table you want to scrape."
        });
    } else {
        dofinalOperation();

        var successBox = document.getElementById('success_message');
        successBox.innerText = "✔ Data saved successfully! You can now close the browser and return to your terminal.";
        successBox.style.display = "block";
    }
});

function dofinalOperation() {
    var fieldValue = {
        table_path: table_path,
        next_path: next_path
    };
    window.inputFieldValues = [];
    window.inputFieldValues.push(fieldValue);
    window.userTasksCompleted = true;
}