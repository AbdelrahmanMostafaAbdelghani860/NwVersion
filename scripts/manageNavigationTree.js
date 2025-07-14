function openModule(module) {
    localStorage.setItem('currentModule', module);
    window.location.href = 'modules/modules.html';
}

function loadModule(module) {
    const moduleNumber = module.split('_')[1].replace('module', '');
    fetch('modules/module' + moduleNumber + '.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Module not found');
            }
            return response.text();
        })
        .then(html => {
            document.getElementById(module).innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading module:', error);
            document.getElementById(module).innerHTML = '<p>Error loading module content</p>';
        });
}

function initSubtrees() {
    console.log('Loading navigation tree...');
    for (i = 1; i <= 4; i++) {
        loadModule('pc_module' + i);
        //loadModule('mobile_module' + i); //future update
    }
    console.log('Loaded navigation tree');
}
document.addEventListener('DOMContentLoaded', function() {
    if ('currentModule' in localStorage) {
        console.log(localStorage.getItem('currentModule'));
    }
    //updateTranslations(localStorage.getItem('lang'));
});

function unfoldNavigationTree(subtree) {
    let this_subtree_list = [];
    let another_subtree_list = [];
    moduleName = subtree.split('_')[0];
    moduleElements = document.querySelectorAll('[class^="' + moduleName + '_"]');
    switch (true) {
        case subtree.includes('module_subtree'):
            document.querySelectorAll('*').forEach(function(element) {
                if (element.className && /module_subtree/.test(element.className)) {
                    if (element.className.includes(moduleName)) {
                        this_subtree_list.push(element);
                    } else {
                        another_subtree_list.push(element);
                    }
                }
            });
            document.querySelectorAll('*').forEach(function(element) {
                if (element.className && /unit_subtree/.test(element.className)) {
                    another_subtree_list.push(element);
                }
            });
            break;
        case subtree.includes('unit_subtree'):
            document.querySelectorAll('*').forEach(function(element) {
                if (element.className && /module_subtree/.test(element.className)) {
                    if (element.className.includes(moduleName)) {
                        this_subtree_list.push(element);
                    } else if (element.className === subtree) {
                        this_subtree_list.push(element);
                    } else {
                        another_subtree_list.push(element);
                    }
                }
            });
            document.querySelectorAll('*').forEach(function(element) {
                if (element.className && /unit_subtree/.test(element.className)) {
                    if (element.className === subtree) {
                        this_subtree_list.push(element);
                    } else {
                        another_subtree_list.push(element);
                    }
                }
            });
            break;
    }

    if (subtree.includes('module_subtree')) { //if the user has clicked module for the 2nd time => collapse
        if (this_subtree_list.every((tree) =>
            tree.style.display == 'inline')) {
                document.querySelectorAll('*').forEach(function(element) {
                    if (element.className && new RegExp(moduleName + '.*module_subtree').test(element.className)) {
                        element.style.display = 'none';
                    }
                });
                document.querySelectorAll('*').forEach(function(element) {
                    if (element.className && new RegExp(moduleName + '.*unit_subtree').test(element.className)) {
                        element.style.display = 'none';
                    }
                });
            return;
        }
    }
    this_subtree_list.forEach((tree) => {
        if (tree.style.display == 'inline' && tree.classList.value == 
            subtree) { //if the user has clicked a unit for the 2nd time => collapse
                tree.style.display = 'none';
        } else {
            tree.style.display = 'inline';
        }
    });
    another_subtree_list.forEach((subtree) =>
        subtree.style.display = 'none');
}
