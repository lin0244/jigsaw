import {Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, Renderer2} from "@angular/core";
import {AffixUtils} from "../../core/utils/internal-utils";
import {CallbackRemoval, CommonUtils} from "../../core/utils/common-utils";

@Directive({
    selector: '[jigsaw-movable], [jigsawMovable]'
})
export class JigsawMovable implements OnInit, OnDestroy {
    private _movableTarget: HTMLElement;
    private _host: HTMLElement;
    private _moving: boolean = false;
    private _position: number[];

    private _removeHostMouseDownListener: CallbackRemoval;
    private _removeWindowMouseMoveListener: CallbackRemoval;
    private _removeWindowMouseUpListener: CallbackRemoval;

    @Input()
    public movableAffected: string;

    constructor(private _renderer: Renderer2,
                private _elementRef: ElementRef,
                private _zone: NgZone) {
    }

    private _dragStart = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this._position = [event.clientX - AffixUtils.offset(this._movableTarget).left,
            event.clientY - AffixUtils.offset(this._movableTarget).top];
        this._moving = true;

        if (this._removeWindowMouseMoveListener) {
            this._removeWindowMouseMoveListener();
        }
        this._zone.runOutsideAngular(() => {
            this._removeWindowMouseMoveListener = this._renderer.listen(document, 'mousemove', this._dragMove);
        });

        if (this._removeWindowMouseUpListener) {
            this._removeWindowMouseUpListener();
        }
        this._removeWindowMouseUpListener = this._renderer.listen(document, 'mouseup', this._dragEnd);
    };

    private _dragMove = (event) => {
        if (this._moving) {
            const ox = event.clientX - this._position[0];
            const oy = event.clientY - this._position[1];
            this._renderer.setStyle(this._movableTarget, 'left', ox + 'px');
            this._renderer.setStyle(this._movableTarget, 'top', oy + 'px');
        }
    };

    private _dragEnd = () => {
        this._moving = false;
        this._position = null;
        this._removeWindowListener();
    };

    ngOnInit() {
        this._host = this._elementRef.nativeElement;
        this._movableTarget = this.movableAffected ?
            CommonUtils.getParentNodeBySelector(this._host, this.movableAffected) : this._host;

        if (this._isElementAffixed(this._movableTarget)) {
            if (this._removeHostMouseDownListener) {
                this._removeHostMouseDownListener();
            }
            setTimeout(() => {
                this._removeHostMouseDownListener = this._renderer.listen(this._host, 'mousedown', this._dragStart);
            })
        }
    }

    private _isElementAffixed(element: HTMLElement): boolean {
        if (!(element instanceof HTMLElement)) return false;
        const positionType = element.style.position;
        return positionType == 'fixed' || positionType == 'absolute';
    }

    private _removeWindowListener() {
        if (this._removeWindowMouseMoveListener) {
            this._removeWindowMouseMoveListener();
        }
        if (this._removeWindowMouseUpListener) {
            this._removeWindowMouseUpListener();
        }
    }

    ngOnDestroy() {
        if (this._removeHostMouseDownListener) {
            this._removeHostMouseDownListener();
        }
        this._removeWindowListener();
    }
}


