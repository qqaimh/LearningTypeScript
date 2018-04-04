import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "app-text-field",
    template: `
    <div>
        {this._renderError()}
        <div className="form-group">
            <label>{this.props.title}</label>
            <input
                type="text"
                className="form-control"
                id={this.props.id}
                placeholder={this.props.placeholder}
                onKeyUp={(e) => this.props.onChange((e.target as any).value)}
            />
        </div>
    </div>
    `
})
export class TextField {
    @Input() public title!: string;
    @Input() public id!: string;
    @Input() public placeholder!: string;
    @Input() public value!: any;
    @Input() public isValid!: (value: any) => boolean;
    @Input() public onChange = new EventEmitter<string>();
    private _renderError() {
        if (!this.props.isValid(this.props.value)) {
            return (
                <ErrorMsg msg="Invalid input value!" />
            );
        }
    }
}