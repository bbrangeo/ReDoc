'use strict';

import { getChildDebugElement, mouseclick } from 'tests/helpers';
import {Component, View} from 'angular2/core';

import {
  TestComponentBuilder,
  inject,
  beforeEach,
  it
} from 'angular2/testing';

import Zippy from 'lib/common/components/Zippy/zippy';


describe('Zippy Component', () => {
  let builder;
  let component;
  let nativeElement;
  let fixture;

  beforeEach(inject([TestComponentBuilder], (tcb) => {
    builder = tcb;
  }));
  beforeEach((done) => {
    builder.createAsync(TestApp).then(_fixture => {
      fixture = _fixture;
      let debugEl = getChildDebugElement(fixture.debugElement, 'zippy');
      component = debugEl.componentInstance;
      nativeElement = debugEl.nativeElement;
      done();
    }, err => done.fail(err));
  });


  it('should init component', () => {
    expect(component).not.toBeNull();
  });

  it('should init component defaults', () => {
    component.empty.should.be.false;
    component.visible.should.be.false;
    component.type.should.be.equal('general');
  });

  it('should init properties from dom params', () => {
    fixture.detectChanges();
    component.visible.should.be.true;
    component.empty.should.be.true;
    component.title.should.be.equal('Zippy');
    component.type.should.be.equal('test');
  });

  it('should open and close zippy', () => {
    fixture.detectChanges();
    component.empty = false;
    component.visible = true;
    fixture.detectChanges();

    let testComponent = fixture.debugElement.componentInstance;

    let titleEl = nativeElement.querySelector('.zippy-title');
    mouseclick(titleEl);
    fixture.detectChanges();
    component.visible.should.be.false;
    testComponent.opened.should.be.false;

    mouseclick(titleEl);
    fixture.detectChanges();
    component.visible.should.be.true;
    testComponent.opened.should.be.true;
  });

  it('should disable empty zippy', () => {
    fixture.detectChanges();
    component.empty = true;
    fixture.detectChanges();

    let testComponent = fixture.debugElement.componentInstance;

    let titleEl = nativeElement.querySelector('.zippy-title');
    mouseclick(titleEl);
    fixture.detectChanges();
    testComponent.clickCount.should.be.equal(0);
  });
});


/** Test component that contains an ApiInfo. */
@Component({selector: 'test-app'})
@View({
  directives: [Zippy],
  template:
      `<zippy title="Zippy" type="test" visible="true" empty="true" (open)="open()" (close)="close()">
        test
      </zippy>`
})
class TestApp {
  constructor() {
    this.opened = false;
    this.clickCount = 0;
  }
  open() {
    this.opened = true;
    this.clickCount++;
  }
  close() {
    this.opened = false;
    this.clickCount++;
  }
}