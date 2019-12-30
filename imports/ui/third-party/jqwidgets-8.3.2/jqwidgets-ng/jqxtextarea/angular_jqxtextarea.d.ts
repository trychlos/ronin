/// <reference path="../jqwidgets.d.ts" />
import { EventEmitter, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
export declare class jqxTextAreaComponent implements ControlValueAccessor, OnChanges {
    attrDisabled: boolean;
    attrDisplayMember: string;
    attrDropDownWidth: number | string;
    attrItems: number;
    attrMaxLength: number;
    attrMinLength: number;
    attrOpened: boolean;
    attrPlaceHolder: string;
    attrPopupZIndex: number;
    attrQuery: string;
    attrRenderer: (itemValue: any, inputValue: any) => any;
    attrRoundedCorners: boolean;
    attrRtl: boolean;
    attrScrollBarSize: number;
    attrSearchMode: string;
    attrSource: any;
    attrTheme: string;
    attrValueMember: string;
    attrWidth: string | number;
    attrHeight: string | number;
    autoCreate: boolean;
    properties: string[];
    host: any;
    elementRef: ElementRef;
    widgetObject: jqwidgets.jqxTextArea;
    private onTouchedCallback;
    private onChangeCallback;
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
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setOptions(options: any): void;
    disabled(arg?: boolean): boolean;
    displayMember(arg?: string): string;
    dropDownWidth(arg?: number | string): number | string;
    height(arg?: string | number): string | number;
    items(arg?: number): number;
    maxLength(arg?: number): number;
    minLength(arg?: number): number;
    opened(arg?: boolean): boolean;
    placeHolder(arg?: string): string;
    popupZIndex(arg?: number): number;
    query(arg?: string): string;
    renderer(arg?: (itemValue: any, inputValue: any) => any): (itemValue: any, inputValue: any) => any;
    roundedCorners(arg?: boolean): boolean;
    rtl(arg?: boolean): boolean;
    scrollBarSize(arg?: number): number;
    searchMode(arg?: string): string;
    source(arg?: any): any;
    theme(arg?: string): string;
    valueMember(arg?: string): string;
    width(arg?: string | number): string | number;
    destroy(): void;
    focus(): void;
    refresh(): void;
    render(): void;
    selectAll(): void;
    val(value?: string): any;
    onChange: EventEmitter<any>;
    onClose: EventEmitter<any>;
    onOpen: EventEmitter<any>;
    onSelect: EventEmitter<any>;
    __wireEvents__(): void;
}
