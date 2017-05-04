# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

version_info = (7, 0, 0, 'alpha', 6)

_specifier_ = {'alpha': 'a', 'beta': 'b', 'candidate': 'rc', 'final': ''}

__version__ = '%s.%s.%s%s'%(version_info[0], version_info[1], version_info[2],
  '' if version_info[3]=='final' else _specifier_[version_info[3]]+str(version_info[4]))

__protocol_version__ = '2.0.0'
__jupyter_widget_version__ = '3.0.0'
