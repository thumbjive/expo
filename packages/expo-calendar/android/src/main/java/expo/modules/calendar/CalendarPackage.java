package expo.modules.calendar;

import android.content.Context;

import java.util.Collections;
import java.util.List;

import expo.core.BasePackage;
import expo.core.ExportedModule;
import expo.core.ViewManager;

public class CalendarPackage extends BasePackage {
  @Override
  public List<ExportedModule> createExportedModules(Context context) {
    return Collections.singletonList((ExportedModule) new CalendarModule(context));
  }

  @Override
  public List<ViewManager> createViewManagers(Context context) {
    return Collections.singletonList((ViewManager) new CalendarViewManager());
  }
}
