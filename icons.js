'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var color = require('color');
var CSON = require('cson-parser');
var fs = require('fs');
var Hugo = require('alfred-hugo');
var path = require('path');
var svgexport = require('svgexport');

var octicons = require('octicons');
var octiconsPath = path.join(path.dirname(require.resolve('octicons')), 'build', 'svg');

var Icons = function () {
    function Icons() {
        (0, _classCallCheck3.default)(this, Icons);
    }

    (0, _createClass3.default)(Icons, [{
        key: '_pathColor',
        value: function _pathColor() {
            var iconColor = color('#FFFFFF');

            if (Hugo.alfredThemeFile) {
                try {
                    iconColor = color(Hugo.alfredTheme.result.text.color);
                } catch (e) {}
            } else if (process.env.alfred_theme_background) {
                var bgColor = color(process.env.alfred_theme_background);
                iconColor = bgColor.grayscale().negate();
            }

            return iconColor.rgb().string();
        }
    }, {
        key: 'rebuild',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(icons) {
                var homedir, projectsFile, projects, octiconNames, i, icon, iconSize, iconPath, renderQueue, options, _i, _icon;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                icons = icons || [];

                                if (icons.length === 0) {
                                    homedir = process.env.HOME || '';
                                    projectsFile = fs.readFileSync(path.join(homedir, '.atom', 'projects.cson'));
                                    projects = CSON.parse(projectsFile) || [];
                                    octiconNames = (0, _keys2.default)(octicons);


                                    for (i = 0; i < projects.length; i++) {
                                        icon = projects[i].icon;

                                        if (icon && icon.startsWith('icon-') && octiconNames.indexOf(icon.slice(5)) >= 0) {
                                            icons.push(icon.slice(5));
                                        }
                                    }
                                }

                                console.error(icons);

                                iconSize = 64;


                                if (Hugo.alfredThemeFile) {
                                    try {
                                        iconSize = Hugo.alfredTheme.result.iconSize;
                                    } catch (e) {}
                                }

                                iconPath = path.join(__dirname, 'icons');
                                renderQueue = [];
                                options = [iconSize + ':' + iconSize, 'pad', 'path{fill:' + this._pathColor() + '}'];

                                for (_i = 0; _i < icons.length; _i++) {
                                    _icon = icons[_i];


                                    if (_icon && _icon.length > 0) {
                                        renderQueue.push({
                                            input: path.join(octiconsPath, _icon + '.svg'),
                                            output: [[path.join(iconPath, _icon + '.png')].concat(options)]
                                        });
                                    }
                                }

                                svgexport.render(renderQueue, function (err) {
                                    if (err) {
                                        throw err;
                                    }
                                });

                            case 10:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function rebuild(_x) {
                return _ref.apply(this, arguments);
            }

            return rebuild;
        }()
    }]);
    return Icons;
}();

module.exports = new Icons();