import json
import itertools
from itertools import combinations

synergy_dict = {
    "Guardian": [3, 5, 7],
    "Swordmaster": [3, 6],
    "Sorcerer": [3, 5, 7],
    "Shield Master": [2, 4, 6],
    "Assassin": [2, 4, 6],
    "Striker": [3, 5],
    "Healer": [2, 3, 4],   
    "Skill Guard": [2, 3, 4],
    "Boost": [2, 3],
    "Hunter": [2, 4, 6],
    "Ice Dragon": [1],
    "HP Up": [2, 4, 6],
    "TP Recovery": [3, 6],
    "Evasion": [3, 4, 5],
    "Attack Buff": [2, 4, 6],
    "Stun": [2, 4],
    "Invulnerability": [2, 3],
    "Link": [3, 6],
    "Defense Shred": [2, 4, 6],
    "Additional Damage": [3, 6],
    "Attack Speed Up": [2, 4, 6],
    "Nakayoshibu": [3],
    # Let's ignore mirror
    "Fuckmirror": [9]
}

filename = "units.json"

with open(filename, "r") as infile:
    units = json.load(infile)


def get_starting_set(units, required_synergies):
    units_with_required_synergies = [unit for unit in units if any(synergy in required_synergies for synergy in unit['synergies'])]
    min_units = len(units) + 1
    best_starting_sets = []

    for i in range(1, len(units_with_required_synergies) + 1):
        for unit_combination in combinations(units_with_required_synergies, i):
            starting_set_synergies = {synergy: 0 for synergy in required_synergies}
            for unit in unit_combination:
                for synergy in unit['synergies']:
                    if synergy in required_synergies:
                        starting_set_synergies[synergy] += 1

            if all(count >= required_synergies[synergy] for synergy, count in starting_set_synergies.items()):
                if i < min_units:
                    min_units = i
                    best_starting_sets = [list(unit_combination)]
                elif i == min_units:
                    best_starting_sets.append(list(unit_combination))

    return best_starting_sets

def get_synergy_count(team, synergy):
    return sum([synergy in unit['synergies'] for unit in team])

def is_valid_team(team, required_synergies, synergy_dict):
    for synergy, required_count in required_synergies.items():
        count = get_synergy_count(team, synergy)
        if count < required_count:
            return False

    for synergy, levels in synergy_dict.items():
        count = get_synergy_count(team, synergy)
        if count > max(levels) and synergy not in required_synergies:
            return False

    return True

def get_active_synergies(team, synergy_dict):
    active_synergies = {}
    total_score = 0
    for synergy, levels in synergy_dict.items():
        count = get_synergy_count(team, synergy)
        for level in reversed(levels):
            if count >= level:
                active_synergies[synergy] = level
                total_score += level
                break
    return active_synergies, total_score

def generate_teams(units, required_synergies, synergy_dict):
    starting_sets = get_starting_set(units, required_synergies)
    if not starting_sets:
        return []

    valid_teams = []

    for starting_set in starting_sets:
        remaining_units = [unit for unit in units if unit not in starting_set]
        remaining_slots = 9 - len(starting_set)

        all_combinations = combinations(remaining_units, remaining_slots)
        starting_set_teams = [starting_set + list(combination) for combination in all_combinations if is_valid_team(starting_set + list(combination), required_synergies, synergy_dict)]

        valid_teams.extend(starting_set_teams)

    return valid_teams

def get_top_teams(teams, synergy_dict):
    sorted_teams = sorted(teams, key=lambda t: len(get_active_synergies(t, synergy_dict)), reverse=True)
    return sorted_teams

def print_teams(teams, synergy_dict, num_teams):
    scored_teams = [(team, *get_active_synergies(team, synergy_dict)) for team in teams]
    sorted_teams = sorted(scored_teams, key=lambda x: x[2], reverse=True)[:num_teams]

    for i, (team, active_synergies, team_score) in enumerate(sorted_teams):
        print(f"Team {i + 1}: {[unit['name'] for unit in team]}")
        print("Active synergies: ", end="")
        print(', '.join([f"{synergy} {level}" for synergy, level in active_synergies.items()]))
        print(f"Team score: {team_score}")
        print()



required_synergies = {"Guardian": 7}
teams = generate_teams(units, required_synergies, synergy_dict)

top_teams = get_top_teams(teams, synergy_dict)
print_teams(top_teams, synergy_dict, 10)