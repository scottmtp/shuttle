'use strict';

import ShuttleTheme from '../src/js/ShuttleTheme';

describe('app theme', function() {
 it('should be blue', function() {
   expect(ShuttleTheme.palette.primary1Color).toBe('#1976d2');
 });
});
