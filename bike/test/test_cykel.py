"""
test_cyckel.py
"""

import sys
import unittest
from unittest.mock import patch, MagicMock
import time
from bike.cykel import Scooter

sys.path.append('/app')

class TestScooter(unittest.TestCase):
    """
    TestScooter class
    """
    def test_start(self):
        """
        test_start method
        """
        scooter = Scooter(scooter_id=1)
        scooter.start(customer=123)
        self.assertTrue(scooter.is_running)
        self.assertFalse(scooter.is_available)
        self.assertEqual(scooter.customer, 123)
        self.assertIsNotNone(scooter.usage_start_time)

    @patch('time.sleep', MagicMock())
    @patch('time.time', side_effect=[0, 1, 2, 3, 4, 5])
    def test_simulate_ride(self, time_mock):  # pylint: disable=unused-argument
        """
        test_simulate_ride method
        """
        scooter = Scooter(scooter_id=1, battery_percentage=100)
        scooter.report_position(latitude=59.32593, longitude=18.1386)
        scooter.start(customer=123)

        with patch('builtins.input', return_value='\n'):
            scooter.simulate_ride()

        self.assertTrue(scooter.is_running)
        self.assertFalse(scooter.is_available)
        self.assertNotEqual(scooter.battery_percentage, 90)

    @patch('bike.cykel.time', return_value=time.time() + 5)
    def test_stop(self, time_mock):  # pylint: disable=unused-argument
        """
        test_stop method
        """

        scooter = Scooter(scooter_id=1, battery_percentage=100)
        scooter.start(customer=123)

        # Ensure the log list is empty or not
        if scooter.log:
            last_log = scooter.log[-1]
            self.assertIsNone(last_log.get("trip_cost"))

        with patch('builtins.input', return_value='\n'):
            scooter.stop()

        self.assertFalse(scooter.is_running)
        self.assertTrue(scooter.is_available)
        self.assertNotEqual(scooter.battery_percentage, 95)


if __name__ == '__main__':
    unittest.main()
