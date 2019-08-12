import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-dropdown-search",
  templateUrl: "./dropdown-search.component.html",
  styleUrls: ["./dropdown-search.component.scss"]
})
export class DropdownSearchComponent implements OnInit {
  @Input()
  public style: any = { 'width': '100%' };
  @Input()
  public panelStyle: any = { 'width': '345px' };
  @Input()
  public isFilter: boolean = true;
  @Input()
  public label: string = "";
  @Input()
  public defaultTheme: 'dropdown_bg-black' | 'dropdown_bg-white' = 'dropdown_bg-black';
  @Input()
  public disable: boolean = false;
  @Input()
  public items: any[];
  @Input()
  public selectedItem: string;
  @Output()
  public handleItemChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  public handleChange(): void {
    if (this.selectedItem)
      this.handleItemChange.emit(this.selectedItem);
  }
}
