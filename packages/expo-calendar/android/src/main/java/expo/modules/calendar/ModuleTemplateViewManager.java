package expo.modules.calendar;

import android.content.Context;

import java.util.Arrays;
import java.util.List;

import expo.core.ModuleRegistry;
import expo.core.ViewManager;
import expo.core.interfaces.ModuleRegistryConsumer;

public class CalendarViewManager extends ViewManager<CalendarView> implements ModuleRegistryConsumer {
  private static final String TAG = "ExpoCalendarView";

  private ModuleRegistry mModuleRegistry;

  @Override
  public String getName() {
    return TAG;
  }

  @Override
  public CalendarView createViewInstance(Context context) {
    return new CalendarView(context, mModuleRegistry);
  }

  @Override
  public ViewManagerType getViewManagerType() {
    return ViewManagerType.SIMPLE;
  }

  @Override
  public List<String> getExportedEventNames() {
    return Arrays.asList("onSomethingHappened");
  }

  @Override
  public void setModuleRegistry(ModuleRegistry moduleRegistry) {
    mModuleRegistry = moduleRegistry;
  }
}
