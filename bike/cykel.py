"""
cykel.py
"""
import random
import time
import threading
import sys
import requests

# pylint: disable=R0902
class Scooter:
    """
    Scooter class
    """
    START_COST = 10
    COST_PER_USED_PERCENT = 2
    SPECIAL_ZONE_COST = 20
    fri_ZONE_COST = 15
    SPECIAL_ZONES = [
        {"north": 59.32593, "south": 59.31093, "east": 18.1386, "west": 18.12},
        {"north": 59.32593, "south": 59.33593, "east": 18.0486, "west": 18.0286},
        {"north": 57.7689, "south": 57.7549, "east": 11.9346, "west": 11.9146},
        {"north": 56.13447, "south": 56.079, "east": 12.7550456, "west": 12.7020456},
        {"north": 55.604107, "south": 55.614107, "east": 13.086877, "west": 13.0},
    ]
    parking_ZONES = [
            {"north": 59.32593, "south": 59.31093, "east": 18.1386, "west": 18.12},
            {"north": 59.32593, "south": 59.33593, "east": 18.0486, "west": 18.0286},
            {"north": 59.33593, "south": 59.3253, "east": 18.099, "west": 18.05386},
            {"north": 59.2993, "south": 59.2793, "east": 18.0002, "west": 17.9586},
            {"north": 57.7689, "south": 57.7549, "east": 11.9346, "west": 11.9146},
            {"north": 57.7689, "south": 57.7389, "east": 11.9846, "west": 11.9546},
            {"north": 56.13447, "south": 56.079, "east": 12.7550456, "west": 12.7020456},
            {"north": 56.03447, "south": 55.9999, "east": 12.7550456, "west": 12.7020456},
            {"north": 55.604107, "south": 55.614107, "east": 13.086877, "west": 13.0},
            {"north": 55.594107, "south": 55.554107, "east": 13.086877, "west": 13.0},
            # Add more special zones as needed
        ]

    def __init__(self, scooter_id, battery_percentage=100):
        """
        constructor
        """
        self.scooter_id = scooter_id
        self.latitude = None
        self.longitude = None
        self.speed = 0
        self.is_running = False
        self.is_available = True
        self.customer = None
        self.log = []
        self.battery_percentage = battery_percentage
        self.stop_simulation = False
        self.usage_start_time = None
        self.total_cost = 0
        self.distance_in_km = 0
        self.current_zone = None
        self.fri_zone = None

    def report_position(self, latitude, longitude):
        """
        report_position method
        """
        self.latitude = latitude
        self.longitude = longitude
        for zone in self.SPECIAL_ZONES:
            if (
                zone["south"] <= latitude <= zone["north"]
                and zone["west"] <= longitude <= zone["east"]
            ):
                self.current_zone = "SpecialZone"
                print("parkerade i förbjuden parkering")
            else:
                self.current_zone = None
        for zone in self.parking_ZONES:
            if (
                zone["south"] <= latitude <= zone["north"]
                and zone["west"] <= longitude <= zone["east"]
            ):
                self.fri_zone = None
            else:
                self.fri_zone = "SpecialZone"
                print("parkerade utan för parkering zone")


    def start(self, customer):
        """
        start method
        """
        if not self.is_running and self.is_available:
            self.is_running = True
            self.is_available = False
            self.customer = customer
            self.usage_start_time = time.time()
            print(f"Scooter {self.scooter_id} har blivit startad av användare {customer}. "
                f"Start kostnad: {self.START_COST} kr.")

    def stop(self):
        """
        stop method
        """
        if self.is_running:
            self.is_running = False
            self.is_available = True

            if self.usage_start_time is not None and self.log:
                elapsed_time = time.time() - self.usage_start_time
                used_battery_percentage = elapsed_time
                usage_cost = used_battery_percentage * self.COST_PER_USED_PERCENT
                if self.current_zone == "SpecialZone":
                    usage_cost += self.SPECIAL_ZONE_COST
                if self.fri_zone == "SpecialZone":
                    usage_cost += self.fri_ZONE_COST

                self.total_cost += int(usage_cost) + self.START_COST
                self.log[-1]["trip_cost"] = int(usage_cost) + self.START_COST

                # Add receipt functionality
                self.send_receipt()
                print("Åkturen avslutad")

            self.usage_start_time = None

    def simulate_ride(self):
        """
        simulate_ride method
        """
        if self.is_running and self.battery_percentage > 0 and not self.stop_simulation:
            print(f"Scooter {self.scooter_id} körs.")
            start_position = (self.latitude, self.longitude)
            start_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

            while self.is_running and self.battery_percentage > 0 and not self.stop_simulation:
                time.sleep(1)
                self.battery_percentage -= 1
                self.speed = random.uniform(5, 15)
                self.latitude += random.uniform(-0.001, 0.001)
                self.longitude += random.uniform(-0.001, 0.001)

                # Estimate distance traveled based on the battery level
                distance = 1  # Adjust this constant factor for a rough estimation
                self.distance_in_km += distance

                # Update scooter data for all scooter_id values
                self.update_scooter_data()

                # Print the status line and overwrite the previous line
                print(f"\n\rBatteri: {self.battery_percentage}%,\n"
                    f"Hastighet: {self.speed} m/s,\n"
                    f"Position: ({self.latitude}, {self.longitude}),\n"
                    f"Distans: {self.distance_in_km:.2f} km\n\n\n", end='')

            end_position = (self.latitude, self.longitude)
            end_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
            self.log_trip(start_position, start_time, end_position, end_time, self.customer)

            if self.battery_percentage == 0:
                print(f"\nScooter {self.scooter_id} har inget batteri kvar. Stanna och ladda.")

            # Update scooter data even when the scooter stops
            self.update_scooter_data()

    # pylint: disable=R0913
    def log_trip(self, start_position, start_time, end_position, end_time, customer):
        """
        log_trip method
        """
        trip = {
            "start_position": start_position,
            "start_time": start_time,
            "end_position": end_position,
            "end_time": end_time,
            "customer": customer,
            "trip_cost": 0,
            "distance_traveled": self.distance_in_km
        }
        self.log.append(trip)

    def update_scooter_data(self):
        """
        update_scooter_data method
        """
        update_url = f"http://localhost:3050/elcyckel/v1/scooters/{self.scooter_id}"
        update_data = {
            "scooter_id": self.scooter_id,
            "latitude": str(self.latitude),
            "longitude": str(self.longitude),
            "battery_level": self.battery_percentage,
        }
        try:
            # pylint: disable=W3101
            update_response = requests.put(update_url, json=update_data)
            if update_response.status_code == 200:
                print("")
            else:
                print(f"Failed to update scooter data for scooter_id {self.scooter_id}."
                    f"Status code: {update_response.status_code}")
        except Exception as exception:  # pylint: disable=W0703
            print(f"An error occurred while updating scooter data: {exception}")
            print(f"Exception type: {type(exception)}")


    def send_receipt(self):
        """
        send_receipt method
        """
        receipt_data = {
            "user_id": self.customer,
            "scooter_id": self.scooter_id,
            "amount": f"{self.total_cost:.2f}",
            "start_time": self.log[-1]["start_time"],
            "end_time": self.log[-1]["end_time"],
            "distance_in_km": f"{self.distance_in_km:.2f}"
        }

        receipt_url = "http://localhost:3050/elcyckel/v1/receipt"
        try:
            # pylint: disable=W3101
            receipt_response = requests.post(receipt_url, json=receipt_data)
            if receipt_response.status_code == 200:
                print("")
            else:
                print(f"Failed to send receipt for user_id {self.customer}."
                      f"Status code: {receipt_response.status_code}")
        except Exception as exception:  # pylint: disable=W0703
            print(f"An error occurred while sending the receipt: {exception}")

def main():
    """
    Main function to start and simulate a scooter ride.
    """
    if len(sys.argv) < 3:
        print("Please provide both scooter_id and user_id as command-line arguments.")
        sys.exit(1)

    scooter_id_to_find = int(sys.argv[1])
    user_id = int(sys.argv[2])

    api_url = "http://localhost:3050/elcyckel/v1/scooters"
    # pylint: disable=W3101
    response = requests.get(api_url)

    if response.status_code == 200:
        scooters_data = response.json()
        using_scooters = [
            scooter for scooter in scooters_data
            if scooter['scooter_hire'] == 'Activated'
        ]
        selected_scooter = next(
            (scooter for scooter in using_scooters if scooter['scooter_id'] == scooter_id_to_find),
            None
        )

        if selected_scooter:
            scooter = Scooter(
                scooter_id=selected_scooter['scooter_id'],
                battery_percentage=selected_scooter['battery_level']
            )
            scooter.report_position(
                latitude=float(selected_scooter['latitude']),
                longitude=float(selected_scooter['longitude'])
            )
            scooter.start(customer=user_id)  # Pass user_id as customer

            sim_thread = threading.Thread(target=scooter.simulate_ride)
            sim_thread.start()

            input("Tryck Enter för att avsluta åkturen\n")
            scooter.stop_simulation = True
            sim_thread.join()

            scooter.stop()

if __name__ == "__main__":
    main()
