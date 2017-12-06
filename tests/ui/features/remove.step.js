const { Given, Then, When } = require('cucumber');
//const { expect } = require('chai')
var assert = require("assert");
var first_name_before;
var size_before;
var fn_html_before;

Given(/^The contact list is display$/, function (callback)  {
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
When(/^User clicks on remove button of the first contact$/,function (callback) {
    this.browser.visit('http://localhost:3000',(err) => {
        if(err) throw err;
        var tab = this.browser.queryAll("table tbody td a");

        var myContact = this.browser.tabs.current.Contact;
        size_before=myContact.Contacts.instance().size();
        first_name_before=myContact.Contacts.instance().iterator().next().firstName();
        fn_html_before = this.browser.query('table tr:nth-child(2) td:nth-child(1)').innerHTML;
        tab[0].click();

        callback();
    });
});
Then(/^The first contact is removed$/,function (callback) {

    this.browser.visit('http://localhost:3000',(err) => {
        if(err) throw err;
        this.browser.queryAll("table tbody td a")[0].click();
        var myContact = this.browser.tabs.current.Contact;
        var first_name_after=myContact.Contacts.instance().iterator().next().firstName();
        var size_after=myContact.Contacts.instance().size();
        var fn_html_after=this.browser.query('table tr:nth-child(2) td:nth-child(1)').innerHTML;
        assert.ok(fn_html_after !== fn_html_before);
        assert.ok(first_name_before !== first_name_after);
        assert.ok(size_after !== size_before);
        callback();
    });


});

