/// <reference path="../jqwidgets.d.ts" />
import { EventEmitter, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
export declare class jqxTimePickerComponent implements OnChanges {
    attrAutoSwitchToMinutes: boolean;
    attrDisabled: boolean;
    attrFooter: boolean;
    attrFooterTemplate: string;
    attrFormat: string;
    attrMinuteInterval: number;
    attrName: string;
    attrReadonly: boolean;
    attrSelection: string;
    attrTheme: string;
    attrUnfocusable: boolean;
    attrValue: any;
    attrView: string;
    attrWidth: string | number;
    attrHeight: string | number;
    autoCreate: boolean;
    properties: string[];
    host: any;
    elementRef: ElementRef;
    widgetObject: jqwidgets.jqxTimePicker;
    constructor(containerElement: ElementRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): boolean;
    arraysEqual(attrValue: any, hostValue: any): boolean;
    manageAttributes(): any;
    moveClasses(parentEl: HTMLElement, childEl: HTMLElement): void;
    moveStyles(parentEl: HTMLElement, childEl: HTMLElement): void;
    createComponent(options?: any): void;
    createWidget(options?: any): void;
    __updateRect__(): void;
    setOptions(options: any): void;
    autoSwitchToMinutes(arg?: boolean): boolean;
    disabled(arg?: boolean): boolean;
    footer(arg?: boolean): boolean;
    footerTemplate(arg?: string): string;
    format(arg?: string): string;
    height(arg?: number | string): number | string;
    minuteInterval(arg?: number): number;
    name(arg?: string): string;
    readonly(arg?: boolean): boolean;
    selection(arg?: string): string;
    theme(arg?: string): string;
    unfocusable(arg?: boolean): boolean;
    value(arg?: any): any;
    view(arg?: string): string;
    width(arg?: number | string): number | string;
    setHours(hours: number): void;
    setMinutes(minutes: number): void;
    onChange: EventEmitter<any>;
    __wireEvents__(): void;
}
