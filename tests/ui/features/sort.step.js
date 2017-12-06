const { Given, Then, When } = require('cucumber');
//const { expect } = require('chai')
var assert = require("assert");

Given(/^The contact list is display sort$/, function (callback)  {
    this.browser.visit('http://localhost:3000',(err) => {
        if(err) throw err;
        assert.equal(this.browser.query('table tr th#cellFirstName').innerHTML,'First name');
        assert.equal(this.browser.query('table tr th#cellLastName').innerHTML,'Last name');
        assert.equal(this.browser.query('table tr th#cellPhones').innerHTML,'Phones');
        assert.equal(this.browser.query('table tr th#cellMails').innerHTML,'Mails');
        assert.equal(this.browser.query('table tr th#cellTags').innerHTML,'Tags');
        var myContact = this.browser.tabs.current.Contact;
        var it=myContact.Contacts.instance().iterator();
        var cpt=2;
        while(it.hasNext()){
            var t=it.next();
            var first=t.firstName();
            var last=t.lastName();
            assert.equal(this.browser.query('table tr:nth-child('+cpt+') td:nth-child(1)').innerHTML, first);
            assert.equal(this.browser.query('table tr:nth-child('+cpt+') td:nth-child(2)').innerHTML, last);
            cpt+=1;
        }
        callback();
    });
});
When(/^User clicks on sort button$/,function (callback) {
    this.browser.visit('http://localhost:3000',(err) => {
        if(err) throw err;
        this.browser.query('#button_sort').click();
        callback();
    });
});
Then(/^The contact list is sorted$/,function (callback) {
    this.browser.visit('http://localhost:3000',(err) => {
        if(err) throw err;
        var br=this.browser;
        var getFirstNamesFromHtml= function () {
            var arr_html=[];
            var nb_contacts=br.queryAll('table tr td').length%br.queryAll('table tr').length;
            for(var i=0;i<nb_contacts;i++){
                arr_html.push(br.queryAll('table tr td')[1+i*6].innerHTML);
            }
            return arr_html;
        };
        var arr_html_sorted_with_function=getFirstNamesFromHtml();
        arr_html_sorted_with_function.sort();
        br.query('#button_sort').click();
        var arr_html_sorted_with_button=getFirstNamesFromHtml();
        var isSame=true;
        for(var i = 0;i<arr_html_sorted_with_function.length;i++){
            if(arr_html_sorted_with_function[i] !== arr_html_sorted_with_button[i]){
                isSame=false;
            }
        }
        assert.ok(isSame);
        callback();
    });
});
