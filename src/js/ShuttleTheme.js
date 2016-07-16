import {
  blue700, blue900, blue300, grey300,
  deepOrangeA200, deepOrangeA400, deepOrangeA100,
  white, darkBlack,
} from 'material-ui/styles/colors';
import Spacing from 'material-ui/styles/spacing';
import {fade} from 'material-ui/utils/colorManipulator';

module.exports = {
  spacing: Spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: blue700,
    primary2Color: blue900,
    primary3Color: blue300,
    accent1Color: deepOrangeA200,
    accent2Color: deepOrangeA400,
    accent3Color: deepOrangeA100,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3)
  }
};
