/*
 * Backpack - Skyscanner's Design System
 *
 * Copyright 2016-2020 Skyscanner Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package net.skyscanner.backpack.reactnative.calendar

import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import org.threeten.bp.LocalDate

interface DateMatcher {
  companion object {
    fun fromJs(type: String, dates: Array<LocalDate>): DateMatcher {
      return when (type) {
        "range" -> RangeMatcher(dates[0], dates[1])
        "after" -> AfterMatcher(dates[0])
        "before" -> BeforeMatcher(dates[0])
        "any" -> AnyMatcher(dates)
        else -> throw JSApplicationIllegalArgumentException("Unsupported date matcher type: $type")
      }
    }
  }

  fun match(date: LocalDate): Boolean
}

internal data class RangeMatcher(internal val start: LocalDate, internal val end: LocalDate) : DateMatcher {
  override fun match(date: LocalDate): Boolean {
    return date in start..end
  }
}

internal data class AfterMatcher(internal val start: LocalDate) : DateMatcher {
  override fun match(date: LocalDate): Boolean {
    return date > start
  }
}

internal data class BeforeMatcher(internal val end: LocalDate) : DateMatcher {
  override fun match(date: LocalDate): Boolean {
    return date < end
  }
}

internal data class AnyMatcher(internal val dates: Array<LocalDate>) : DateMatcher {
  override fun match(date: LocalDate): Boolean {
    return dates.any { it == date }
  }

  override fun equals(other: Any?): Boolean {
    if (this === other) return true
    if (javaClass != other?.javaClass) return false

    other as AnyMatcher

    if (!dates.contentEquals(other.dates)) return false

    return true
  }

  override fun hashCode(): Int {
    return dates.contentHashCode()
  }
}
